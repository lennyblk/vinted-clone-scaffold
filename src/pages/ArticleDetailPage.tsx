import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("fr-FR");

const fetchArticle = async (id: string) => api.get<Article>(`/api/articles/${id}`);

export default function ArticleDetailPage() {
  const { id } = useParams();

  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useQuery<Article, Error>({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id ?? ""),
    enabled: Boolean(id),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Détail de l&apos;article</h1>
          <p className="text-sm text-gray-600">Toutes les informations sur l&apos;article sélectionné.</p>
        </div>
        <Link
          to="/"
          className="rounded-full border border-teal-600 bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
        >
          Retour au catalogue
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">Chargement de l&apos;article...</div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
          Erreur : {(error as Error)?.message || "Impossible de charger l'article."}
        </div>
      ) : !article ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          Article introuvable.
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-96 w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-semibold text-gray-900">{article.title}</h2>
              <p className="mt-3 text-2xl font-semibold text-teal-600">{formatPrice(article.price)}</p>
              <p className="mt-5 text-gray-700 whitespace-pre-line">{article.description}</p>
            </div>

            <div className="grid gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Catégorie</h3>
                <p className="mt-2 text-gray-900">
                  {CATEGORIES.find((cat) => cat.id === article.category)?.label ?? article.category}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">État</h3>
                <p className="mt-2 text-gray-900">
                  {CONDITIONS.find((cond) => cond.value === article.condition)?.label ?? article.condition}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Taille</h3>
                <p className="mt-2 text-gray-900">{article.size}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Vendeur</h3>
                <p className="mt-2 text-gray-900">{article.userName}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Publié le</h3>
                <p className="mt-2 text-gray-900">{formatDate(article.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
