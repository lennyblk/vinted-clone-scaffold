import { Link } from "react-router-dom";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

type Props = {
  article: Article;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};


export default function ArticleCard({
  article,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const categoryLabel =
    CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category;
  const conditionLabel =
    CONDITIONS.find((c) => c.value === article.condition)?.label ??
    article.condition;

  return (
    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/articles/${article.id}`} className="block">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/400x300?text=Image+indisponible";
          }}
        />
        <div className="p-3">
          <p className="font-semibold text-gray-900 truncate">{article.title}</p>
          <p className="text-teal-600 font-bold mt-1">
            {article.price} €
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {categoryLabel}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {conditionLabel}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2 truncate">{article.userName}</p>
        </div>
      </Link>

      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:scale-110 transition-transform"
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              isFavorite
                ? "fill-red-500 stroke-red-500"
                : "fill-none stroke-gray-400 hover:stroke-red-400"
            }`}
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
