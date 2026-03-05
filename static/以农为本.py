from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
import os
import logging
from typing import List, Dict, Any, Optional, Tuple, Union
from datetime import datetime

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 配置常量
MILVUS_HOST = os.getenv("MILVUS_HOST", "localhost")
MILVUS_PORT = os.getenv("MILVUS_PORT", "19530")
MILVUS_USER = os.getenv("MILVUS_USER", "")
MILVUS_PASSWORD = os.getenv("MILVUS_PASSWORD", "")
DEFAULT_COLLECTION = "documents_collection"
DIMENSION = int(os.getenv("EMBED_DIM", "1536"))  # 与 Embedding 模型输出维度一致
MAX_DOC_ID_LENGTH = 256

class MilvusManager:
    """Milvus 向量数据库管理器"""
    
    def __init__(self, host: str = MILVUS_HOST, port: str = MILVUS_PORT,
                 user: str = MILVUS_USER, password: str = MILVUS_PASSWORD,
                 alias: str = "default"):
        """
        初始化 Milvus 连接管理器
        
        Args:
            host: Milvus 主机地址
            port: Milvus 端口
            user: 用户名
            password: 密码
            alias: 连接别名
        """
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.alias = alias
        self.collections = {}
        self._connect()
    
    def _connect(self) -> bool:
        """建立 Milvus 连接"""
        try:
            if self.user and self.password:
                connections.connect(
                    alias=self.alias,
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password
                )
            else:
                connections.connect(
                    alias=self.alias,
                    host=self.host,
                    port=self.port
                )
            logger.info(f"成功连接到 Milvus: {self.host}:{self.port}")
            return True
        except Exception as e:
            logger.error(f"连接 Milvus 失败: {str(e)}")
            raise ConnectionError(f"无法连接到 Milvus: {str(e)}")
    
    def ensure_collection(self, name: str = DEFAULT_COLLECTION, 
                         dim: int = DIMENSION, shards: int = 2,
                         index_params: Optional[Dict] = None,
                         consistency_level: str = "Strong") -> Collection:
        """
        确保集合存在，不存在则创建
        
        Args:
            name: 集合名称
            dim: 向量维度
            shards: 分片数量
            index_params: 索引参数
            consistency_level: 一致性级别
        
        Returns:
            Collection 对象
        """
        try:
            # 检查集合是否存在
            if utility.has_collection(name, using=self.alias):
                collection = Collection(name, using=self.alias)
                collection.load()
                logger.info(f"集合 '{name}' 已存在，已加载")
                self.collections[name] = collection
                return collection
            
            # 创建新集合
            fields = [
                FieldSchema(name="pk", dtype=DataType.INT64, 
                          is_primary=True, auto_id=True),
                FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=dim),
                FieldSchema(name="doc_id", dtype=DataType.VARCHAR, 
                          max_length=MAX_DOC_ID_LENGTH),
                FieldSchema(name="metadata", dtype=DataType.JSON),
                FieldSchema(name="created_at", dtype=DataType.INT64),
            ]
            
            schema = CollectionSchema(
                fields, 
                description="Documents embeddings with metadata",
                enable_dynamic_field=True  # 启用动态字段
            )
            
            collection = Collection(
                name, 
                schema=schema, 
                using=self.alias,
                shards_num=shards,
                consistency_level=consistency_level
            )
            
            # 创建向量索引
            if index_params is None:
                index_params = {
                    "index_type": "IVF_FLAT",
                    "metric_type": "L2",
                    "params": {"nlist": 1024}
                }
            
            collection.create_index(
                field_name="embedding", 
                index_params=index_params,
                index_name=f"{name}_embedding_index"
            )
            
            # 可选：为 doc_id 创建标量索引以加速过滤
            collection.create_index(
                field_name="doc_id",
                index_params={"index_type": "Trie"}
            )
            
            collection.load()
            
            logger.info(f"集合 '{name}' 创建成功，维度: {dim}, 分片数: {shards}")
            self.collections[name] = collection
            return collection
            
        except Exception as e:
            logger.error(f"创建/加载集合失败: {str(e)}")
            raise
    
    def insert_vectors(self, collection: Union[str, Collection], 
                      embeddings: List[List[float]], 
                      doc_ids: List[str],
                      metadata_list: Optional[List[Dict]] = None) -> List[int]:
        """
        插入向量数据
        
        Args:
            collection: 集合名称或 Collection 对象
            embeddings: 向量列表
            doc_ids: 文档ID列表
            metadata_list: 元数据列表，可选
        
        Returns:
            插入的主键列表
        """
        try:
            if isinstance(collection, str):
                collection = self.collections.get(collection)
                if not collection:
                    collection = Collection(collection, using=self.alias)
                    collection.load()
            
            # 参数验证
            if len(embeddings) != len(doc_ids):
                raise ValueError("embeddings 和 doc_ids 长度必须一致")
            
            if metadata_list and len(metadata_list) != len(embeddings):
                raise ValueError("metadata_list 长度必须与 embeddings 一致")
            
            # 准备数据
            num_records = len(embeddings)
            timestamp = int(datetime.now().timestamp())
            
            # 准备插入的数据
            data = [
                embeddings,  # embedding 字段
                doc_ids,     # doc_id 字段
                metadata_list or [{}] * num_records,  # metadata 字段
                [timestamp] * num_records,  # created_at 字段
            ]
            
            # 插入数据（pk 字段自动生成）
            insert_result = collection.insert(data)
            
            # 刷新以确保数据可搜索
            collection.flush()
            
            logger.info(f"成功插入 {len(insert_result.primary_keys)} 条记录")
            return insert_result.primary_keys
            
        except Exception as e:
            logger.error(f"插入向量失败: {str(e)}")
            raise
    
    def search_vectors(self, collection: Union[str, Collection],
                      query_embedding: List[float],
                      top_k: int = 5,
                      search_params: Optional[Dict] = None,
                      output_fields: Optional[List[str]] = None,
                      filter_expr: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        搜索相似向量
        
        Args:
            collection: 集合名称或 Collection 对象
            query_embedding: 查询向量
            top_k: 返回结果数量
            search_params: 搜索参数
            output_fields: 返回字段列表
            filter_expr: 过滤表达式
        
        Returns:
            搜索结果列表
        """
        try:
            if isinstance(collection, str):
                collection = self.collections.get(collection)
                if not collection:
                    collection = Collection(collection, using=self.alias)
                    collection.load()
            else:
                # 确保集合已加载
                if not collection.has_index():
                    collection.load()
            
            # 设置默认搜索参数
            if search_params is None:
                search_params = {
                    "metric_type": "L2",
                    "params": {"nprobe": 10, "level": 1}
                }
            
            # 设置默认输出字段
            if output_fields is None:
                output_fields = ["doc_id", "metadata", "created_at"]
            
            # 执行搜索
            search_kwargs = {
                "data": [query_embedding],
                "anns_field": "embedding",
                "param": search_params,
                "limit": top_k,
                "output_fields": output_fields,
            }
            
            if filter_expr:
                search_kwargs["expr"] = filter_expr
            
            results = collection.search(**search_kwargs)
            
            # 格式化结果
            hits = []
            for hit in results[0]:
                result_dict = {
                    "milvus_id": str(hit.id),
                    "score": float(hit.distance),
                    "doc_id": hit.entity.get("doc_id"),
                    "metadata": hit.entity.get("metadata", {}),
                    "created_at": hit.entity.get("created_at"),
                }
                # 添加动态字段
                for key, value in hit.entity.fields.items():
                    if key not in result_dict:
                        result_dict[key] = value
                hits.append(result_dict)
            
            return hits
            
        except Exception as e:
            logger.error(f"搜索向量失败: {str(e)}")
            raise
    
    def delete_by_doc_ids(self, collection: Union[str, Collection],
                         doc_ids: List[str]) -> int:
        """
        根据 doc_id 删除记录
        
        Args:
            collection: 集合名称或 Collection 对象
            doc_ids: 要删除的文档ID列表
        
        Returns:
            删除的记录数量
        """
        try:
            if isinstance(collection, str):
                collection = self.collections.get(collection)
                if not collection:
                    collection = Collection(collection, using=self.alias)
            
            if not doc_ids:
                return 0
            
            # 构建删除表达式
            doc_ids_str = ", ".join([f"'{doc_id}'" for doc_id in doc_ids])
            expr = f"doc_id in [{doc_ids_str}]"
            
            # 执行删除
            delete_result = collection.delete(expr)
            
            logger.info(f"成功删除 {len(doc_ids)} 条记录")
            return delete_result.delete_count
            
        except Exception as e:
            logger.error(f"删除记录失败: {str(e)}")
            raise
    
    def get_collection_stats(self, collection_name: str) -> Dict[str, Any]:
        """
        获取集合统计信息
        
        Args:
            collection_name: 集合名称
        
        Returns:
            统计信息字典
        """
        try:
            if not utility.has_collection(collection_name, using=self.alias):
                return {"error": f"集合 '{collection_name}' 不存在"}
            
            collection = Collection(collection_name, using=self.alias)
            
            stats = {
                "name": collection_name,
                "num_entities": collection.num_entities,
                "schema": str(collection.schema),
                "indexes": collection.indexes,
                "is_loaded": collection.is_loaded,
                "shards_num": collection.shards_num,
                "consistency_level": collection.consistency_level,
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"获取集合统计信息失败: {str(e)}")
            return {"error": str(e)}
    
    def drop_collection(self, collection_name: str) -> bool:
        """
        删除集合
        
        Args:
            collection_name: 集合名称
        
        Returns:
            是否成功删除
        """
        try:
            if utility.has_collection(collection_name, using=self.alias):
                utility.drop_collection(collection_name, using=self.alias)
                if collection_name in self.collections:
                    del self.collections[collection_name]
                logger.info(f"集合 '{collection_name}' 已删除")
                return True
            else:
                logger.warning(f"集合 '{collection_name}' 不存在")
                return False
        except Exception as e:
            logger.error(f"删除集合失败: {str(e)}")
            raise
    
    def close(self):
        """关闭所有连接"""
        try:
            connections.disconnect(self.alias)
            logger.info("Milvus 连接已关闭")
        except Exception as e:
            logger.error(f"关闭连接失败: {str(e)}")

# 兼容原有函数的封装
def ensure_collection(name: str = DEFAULT_COLLECTION, dim: int = DIMENSION, 
                     shards: int = 2) -> Collection:
    """
    兼容原有接口的函数
    
    Args:
        name: 集合名称
        dim: 向量维度
        shards: 分片数量
    
    Returns:
        Collection 对象
    """
    manager = MilvusManager()
    return manager.ensure_collection(name, dim, shards)

def insert_vectors(collection: Collection, embeddings: List[List[float]], 
                   doc_ids: List[str]) -> List[int]:
    """
    兼容原有接口的函数
    
    Args:
        collection: Collection 对象
        embeddings: 向量列表
        doc_ids: 文档ID列表
    
    Returns:
        插入的主键列表
    """
    manager = MilvusManager()
    return manager.insert_vectors(collection, embeddings, doc_ids)

def search_vectors(collection: Collection, query_embedding: List[float], 
                   top_k: int = 4, params: Optional[Dict] = None) -> List[Dict[str, Any]]:
    """
    兼容原有接口的函数
    
    Args:
        collection: Collection 对象
        query_embedding: 查询向量
        top_k: 返回结果数量
        params: 搜索参数
    
    Returns:
        搜索结果列表
    """
    manager = MilvusManager()
    return manager.search_vectors(collection, query_embedding, top_k, params)

# 使用示例
if __name__ == "__main__":
    # 示例用法
    try:
        # 创建管理器
        milvus_manager = MilvusManager()
        
        # 确保集合存在
        collection = milvus_manager.ensure_collection(
            name="test_collection",
            dim=1536,
            shards=2
        )
        
        # 示例数据
        test_embeddings = [[0.1] * 1536, [0.2] * 1536]
        test_doc_ids = ["doc_1", "doc_2"]
        test_metadata = [
            {"title": "文档1", "author": "作者A", "category": "技术"},
            {"title": "文档2", "author": "作者B", "category": "文学"}
        ]
        
        # 插入数据
        pks = milvus_manager.insert_vectors(
            collection=collection,
            embeddings=test_embeddings,
            doc_ids=test_doc_ids,
            metadata_list=test_metadata
        )
        print(f"插入记录的主键: {pks}")
        
        # 搜索相似向量
        query_vector = [0.15] * 1536
        results = milvus_manager.search_vectors(
            collection=collection,
            query_embedding=query_vector,
            top_k=2,
            output_fields=["doc_id", "metadata"]
        )
        print(f"搜索结果: {results}")
        
        # 获取集合统计
        stats = milvus_manager.get_collection_stats("test_collection")
        print(f"集合统计: {stats}")
        
        # 清理测试集合
        milvus_manager.drop_collection("test_collection")
        
        # 关闭连接
        milvus_manager.close()
        
    except Exception as e:
        print(f"执行出错: {str(e)}")