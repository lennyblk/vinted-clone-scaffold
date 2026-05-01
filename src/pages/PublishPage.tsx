import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

export default function PublishPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [size, setSize] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [conditionError, setConditionError] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let valid = true;

    if (title.length < 3 || title.length > 100) {
      setTitleError("Le titre doit faire entre 3 et 100 caractères");
      valid = false;
    } else {
      setTitleError("");
    }

    if (description.length < 10 || description.length > 1000) {
      setDescriptionError("La description doit faire entre 10 et 1000 caractères");
      valid = false;
    } else {
      setDescriptionError("");
    }

    if (!price || Number(price) <= 0) {
      setPriceError("Le prix doit être supérieur à 0");
      valid = false;
    } else {
      setPriceError("");
    }

    if (!category) {
      setCategoryError("Choisissez une catégorie");
      valid = false;
    } else {
      setCategoryError("");
    }

    if (!condition) {
      setConditionError("Choisissez un état");
      valid = false;
    } else {
      setConditionError("");
    }

    if (!size) {
      setSizeError("La taille est requise");
      valid = false;
    } else {
      setSizeError("");
    }

    if (!imageUrl) {
      setImageUrlError("L'URL de l'image est requise");
      valid = false;
    } else {
      setImageUrlError("");
    }

    if (!valid) return;

    setLoading(true);
    setApiError("");
    try {
      const created = await api.post<Article>("/api/articles", {
        title,
        description,
        price: Number(price),
        category,
        condition,
        size,
        imageUrl,
      });
      navigate(`/articles/${created.id}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erreur inconnue");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Publier une annonce</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Ex : Veste en jean bleue"
          />
          {titleError && <p className="text-xs text-red-600 mt-1">{titleError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Décrivez votre article..."
          />
          {descriptionError && <p className="text-xs text-red-600 mt-1">{descriptionError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Ex : 15"
          />
          {priceError && <p className="text-xs text-red-600 mt-1">{priceError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">-- Choisir --</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          {categoryError && <p className="text-xs text-red-600 mt-1">{categoryError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">-- Choisir --</option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {conditionError && <p className="text-xs text-red-600 mt-1">{conditionError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Ex : M, 42, XL..."
          />
          {sizeError && <p className="text-xs text-red-600 mt-1">{sizeError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="https://..."
          />
          {imageUrlError && <p className="text-xs text-red-600 mt-1">{imageUrlError}</p>}
        </div>

        {apiError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
            {apiError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-lg hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? "Publication..." : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
}
