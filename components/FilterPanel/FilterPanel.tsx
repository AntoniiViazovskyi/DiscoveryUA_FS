"use client";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getAllRegions, getAllTypes } from "@/lib/api/filterClient";
import { useState } from "react";
import { sort } from "@/types/categories";
import css from "./FilterPanel.module.css";

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchError, setSearchError] = useState("");

  const { data: regions = [] } = useQuery({
    queryKey: ["regions"],
    queryFn: () => getAllRegions(),
  });
  const { data: types = [] } = useQuery({
    queryKey: ["locationTypes"],
    queryFn: () => getAllTypes(),
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length < 3) {
      setSearchError("Введіть щонайменше 3 символи");
      return;
    }
    setSearchError("");
    updateParam("search", trimmed);
  }, 400);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`);
  };

  const currentTypesString = searchParams.get("type") || "";
  const selectedTypes = currentTypesString ? currentTypesString.split(",") : [];

  const handleCheckboxChange = (slug: string) => {
    const updatedTypes = selectedTypes.includes(slug)
      ? selectedTypes.filter((type) => type !== slug)
      : [...selectedTypes, slug];

    updateParam("type", updatedTypes.join(","));
  };

  return (
    <div className={css.filterContainer}>
      <div className={css.searchWrap}>
        <input
          className={css.filterInput}
          placeholder="Пошук"
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
          aria-invalid={Boolean(searchError)}
          aria-describedby="search-error"
        />
        {searchError && (
          <p id="search-error" className={css.filterError}>
            {searchError}
          </p>
        )}
      </div>
      <div className={css.filterRow}>
        <select
          className={css.filterSelect}
          value={searchParams.get("region") ?? ""}
          onChange={(e) => updateParam("region", e.target.value)}
        >
          <option value="">Регіон</option>
          {regions.map((r) => (
            <option key={r._id} value={r.slug}>
              {r.region}
            </option>
          ))}
        </select>

        <div className={css.typeWrap} tabIndex={0}>
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

      <select
        className={css.filterSort}
        value={searchParams.get("sortBy") ?? ""}
        onChange={(e) => updateParam("sortBy", e.target.value)}
      >
        <option value="" className={css.placeholder}>
          Сортування
        </option>
        {sort.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
