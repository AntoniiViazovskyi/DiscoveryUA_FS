"use client";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllRegions, getAllTypes } from "@/lib/api/filterClient";
import { sort } from "@/types/categories";
import Select from "@/components/Select/Select";
import css from "./FilterPanel.module.css";

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchError, setSearchError] = useState("");
  const urlSearch = searchParams.get("search") ?? "";
  const [searchValue, setSearchValue] = useState(urlSearch);

  const {
    data: regions = [],
    isLoading: isRegionsLoading,
    isError: isRegionsError,
    refetch: refetchRegions,
  } = useQuery({
    queryKey: ["regions"],
    queryFn: () => getAllRegions(),
  });

  const {
    data: types = [],
    isLoading: isTypesLoading,
    isError: isTypesError,
    refetch: refetchTypes,
  } = useQuery({
    queryKey: ["locationTypes"],
    queryFn: () => getAllTypes(),
  });

  const hasCategoriesError = isRegionsError || isTypesError;

  const retryCategories = () => {
    if (isRegionsError) refetchRegions();
    if (isTypesError) refetchTypes();
  };

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length < 3) {
      setSearchError("Введіть щонайменше 3 символи");
      return;
    }
    setSearchError("");
    updateParam("search", trimmed);
  }, 400);

  useEffect(() => {
    handleSearch.cancel();
    setSearchValue(urlSearch);
    setSearchError("");
  }, [urlSearch, handleSearch]);

  const currentTypesString = searchParams.get("type") || "";
  const selectedTypes = currentTypesString ? currentTypesString.split(",") : [];

  const handleCheckboxChange = (slug: string) => {
    const updatedTypes = selectedTypes.includes(slug)
      ? selectedTypes.filter((type) => type !== slug)
      : [...selectedTypes, slug];

    updateParam("type", updatedTypes.join(","));
  };

  const regionOptions = [
    { value: "", label: "Усі регіони" },
    ...regions.map((r) => ({ value: r.slug, label: r.region })),
  ];

  const sortOptions = [{ value: "", label: "Сортування" }, ...sort];

  return (
    <div className={css.filterContainer}>
      <div className={css.searchWrap}>
        <input
          className={css.filterInput}
          placeholder="Пошук"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            handleSearch(e.target.value);
          }}
          aria-label="Пошук локацій"
          aria-invalid={Boolean(searchError)}
          aria-describedby={searchError ? "search-error" : undefined}
        />
        {searchError && (
          <p id="search-error" className={css.filterError}>
            {searchError}
          </p>
        )}
      </div>

      {hasCategoriesError && (
        <div role="alert" className={css.categoriesError}>
          <p>
            Не вдалося завантажити{" "}
            {isRegionsError && isTypesError
              ? "регіони та типи локацій"
              : isRegionsError
                ? "регіони"
                : "типи локацій"}
            . Спробуйте ще раз.
          </p>
          <button type="button" onClick={retryCategories}>
            Повторити
          </button>
        </div>
      )}

      <div className={css.filterRow}>
        <Select
          className={`${css.filterSelect} ${css.hiddenLabel}`}
          label="Фільтр за регіоном"
          placeholder="Регіон"
          options={regionOptions}
          value={searchParams.get("region") ?? ""}
          onChange={(value) => updateParam("region", value)}
          loading={isRegionsLoading}
          disabled={isRegionsError}
        />

        <div
          className={css.typeWrap}
          tabIndex={isTypesError || isTypesLoading ? -1 : 0}
          aria-disabled={isTypesError || isTypesLoading}
          aria-busy={isTypesLoading}
          role="group"
          aria-label="Тип локації"
        >
          <span className={css.typeTitle}>Тип локації</span>

          <div className={css.typeList}>
            {types.map((t) => (
              <label
                key={t._id}
                className={css.checkboxLabel}
                onMouseDown={(e) => e.preventDefault()}
              >
                <input
                  type="checkbox"
                  className={css.checkboxInput}
                  checked={selectedTypes.includes(t.slug)}
                  onChange={() => handleCheckboxChange(t.slug)}
                />
                <span>{t.type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <Select
        className={`${css.filterSort} ${css.hiddenLabel}`}
        label="Сортування результатів"
        placeholder="Сортування"
        options={sortOptions}
        value={searchParams.get("sortBy") ?? ""}
        onChange={(value) => updateParam("sortBy", value)}
      />
    </div>
  );
}
