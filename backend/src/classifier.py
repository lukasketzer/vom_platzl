from dotenv import load_dotenv
load_dotenv()

from .enums.StoreTypes import StoreType
from sentence_transformers import SentenceTransformer, util
import warnings


# Initialize sentence transformer model
# Check if running in a way where we want to load this (it might be heavy)
model = SentenceTransformer("all-MiniLM-L6-v2")

# Pre-compute embeddings for all StoreTypes
# We convert the enum values to a more natural language format (replacing underscores with spaces)
store_types = list(StoreType)
store_descriptions = [s.value.replace("_", " ") for s in store_types]
store_embeddings = model.encode(store_descriptions, convert_to_tensor=True)


def classify_query(query: str, k: int = 1) -> list[StoreType] | StoreType:
    """
    Classifies a natural language query into one or more StoreTypes using semantic similarity.

    This function uses a Sentence Transformer model to compute the cosine similarity
    between the query and pre-defined store descriptions.

    Args:
        query (str): The search query (e.g., "where can I buy bread").
        k (int): Number of top matches to return. If k=1, returns a single StoreType.

    Returns:
        Union[list[StoreType], StoreType]: The best matching store type(s).
    """
    warnings.warn("" \
    "The classify_query function is deprecated and will be removed in a future version.", category=DeprecationWarning, stacklevel=2)
    try:
        # Encode the query
        query_embedding = model.encode(query, convert_to_tensor=True)

        # Compute cosine similarity between query and all store descriptions
        cosine_scores = util.cos_sim(query_embedding, store_embeddings)[0]

        # Find the top k indices
        top_results = cosine_scores.topk(k)
        best_match_indices = top_results.indices.tolist()

        results = [store_types[idx] for idx in best_match_indices]

        return results[0] if k == 1 else results
    except Exception as e:
        print(f"Classification Error: {e}")
        return StoreType.GENERAL_STORE if k == 1 else [StoreType.GENERAL_STORE]
