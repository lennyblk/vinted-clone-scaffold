import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useCurrentUserId } from "../hooks/useCurrentUserId";
import ArticleCard from "../components/ArticleCard";
import type { Article } from "../types/article";

export default function MyArticlesPage() {
  const userId = useCurrentUserId();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Article[]>(`/api/users/${userId}/articles`)
      .then((data) => setArticles(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur inconnue"),
      )
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleDelete(id: string) {
    const ok = window.confirm("Supprimer cette annonce ?");
    if (!ok) return;
    try {
      await api.delete(`/api/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression",
      );
    }
  }

  if (loading) return <p className="text-gray-500">Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (articles.length === 0) {
    return (
      <div className="text-center mt-12">
        <p className="text-gray-500 mb-4">Vous n'avez pas encore d'annonce.</p>
        <Link
          to="/publish"
          className="bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-teal-700"
        >
          Publier une annonce
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes annonces</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <div key={article.id} className="flex flex-col gap-2">
            <ArticleCard article={article} />
            <button
              onClick={() => handleDelete(article.id)}
              className="w-full border border-red-300 text-red-600 text-sm py-1.5 rounded-lg hover:bg-red-50"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
