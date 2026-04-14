import { useEffect, useState } from 'react';
import settingsService from '../services/settingsService';

const DEFAULTS = {
  title: 'Lam Điệp Cô Ảnh',
  subtitle: 'Lam điệp cô ảnh, chấn dực ư vô quang chi dạ.\nTruyền kỳ dị sử, ngưỡng mộ chi tâm.',
  subtitleSecondary: '藍蝶孤影，振翼於無光之夜。\n傳奇異事，令人心生仰慕。',
  image: ''
};

export function useHomeBanner() {
  const [banner, setBanner] = useState({ ...DEFAULTS, loading: true });

  useEffect(() => {
    let cancelled = false;
    settingsService
      .getSettings()
      .then((res) => {
        if (cancelled) return;
        const d = res?.data || {};
        setBanner({
          title: d.bannerTitle || DEFAULTS.title,
          subtitle: d.bannerSubtitle || DEFAULTS.subtitle,
          subtitleSecondary: d.bannerSubtitleSecondary || DEFAULTS.subtitleSecondary,
          image: d.bannerImage || '',
          loading: false
        });
      })
      .catch(() => {
        if (!cancelled) setBanner((b) => ({ ...b, loading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return banner;
}

export default useHomeBanner;
