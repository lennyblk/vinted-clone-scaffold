import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Article } from "../types/article";

export const fetchArticles = async () => {
  try {
    const articles = await api.get("/api/articles");
    return articles as Article[];
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
}

export default function CataloguePage() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchArticles()
      .then((data) => {
        if (mounted) setArticles(data);
      })
      .catch((err) => {
        if (mounted) setError(err?.message ?? "Erreur lors du fetch");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">Erreur : {error}</div>;
  if (!articles || articles.length === 0) return <div>Aucun article</div>;

  return (
    <>
      <h1>Catalogue</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {articles.map((article) => (
          <div key={article.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <p className="text-gray-600">{article.description}</p>
            <p className="text-teal-600 font-bold mt-2">{article.price} €</p>
            <img src={article.imageUrl} alt={article.title} className="mt-2 w-full h-48 object-cover rounded" />
          </div>
        ))}
      </div>
    </>
  );
}