import { useEffect, useState, useMemo } from 'react';
import pageService from '../services/pageService';
import { buildFallback } from '../data/pageDefaults';

export function usePage(slug) {
  const fallback = useMemo(() => buildFallback(slug), [slug]);
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;
    pageService
      .getPage(slug)
      .then((res) => {
        if (!cancelled && res?.data) setData(res.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const valueMap = useMemo(() => {
    const m = {};
    (data?.fields || []).forEach((f) => {
      m[f.key] = f.value ?? f.default ?? '';
    });
    return m;
  }, [data]);

  const get = (key, fallbackValue = '') => valueMap[key] ?? fallbackValue;

  return { data, loading, get, valueMap };
}

export default usePage;
