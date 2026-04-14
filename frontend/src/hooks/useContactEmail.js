import { useEffect, useState } from 'react';
import settingsService from '../services/settingsService';

const FALLBACK_EMAIL = 'khitabolonhauvikhongdatduocten@gmail.com';

export function useContactEmail() {
  const [email, setEmail] = useState(FALLBACK_EMAIL);

  useEffect(() => {
    let cancelled = false;
    settingsService
      .getSettings()
      .then((res) => {
        const value = res?.data?.contactEmail || res?.contactEmail;
        if (!cancelled && value) setEmail(value);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return email;
}

export default useContactEmail;
