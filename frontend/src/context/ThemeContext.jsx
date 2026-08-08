import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    active_preset: 'Academic',
    primary_color: '#1E3A8A',
    secondary_color: '#0D9488',
    accent_color: '#F59E0B',
    background_color: '#F8FAFC',
    text_color: '#0F172A',
    card_color: '#FFFFFF',
    button_color: '#1E3A8A',
    header_color: '#FFFFFF',
    footer_color: '#0F172A',
    font_heading: 'Outfit',
    font_body: 'Inter',
    font_scale: 'medium',
    heading_weight: '700',
    body_weight: '400',
    border_radius: '12px',
    shadow_style: 'modern'
  });

  const [loading, setLoading] = useState(true);

  const applyThemeVariables = (t) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', t.primary_color || '#1E3A8A');
    root.style.setProperty('--secondary-color', t.secondary_color || '#0D9488');
    root.style.setProperty('--accent-color', t.accent_color || '#F59E0B');
    root.style.setProperty('--background-color', t.background_color || '#F8FAFC');
    root.style.setProperty('--text-color', t.text_color || '#0F172A');
    root.style.setProperty('--card-color', t.card_color || '#FFFFFF');
    root.style.setProperty('--button-color', t.button_color || t.primary_color || '#1E3A8A');
    root.style.setProperty('--header-color', t.header_color || '#FFFFFF');
    root.style.setProperty('--footer-color', t.footer_color || '#0F172A');
    root.style.setProperty('--font-heading', `'${t.font_heading || 'Outfit'}', sans-serif`);
    root.style.setProperty('--font-body', `'${t.font_body || 'Inter'}', sans-serif`);
    root.style.setProperty('--heading-weight', t.heading_weight || '700');
    root.style.setProperty('--body-weight', t.body_weight || '400');
    root.style.setProperty('--border-radius', t.border_radius || '12px');

    const scaleMap = { small: '15px', medium: '16px', large: '17.5px' };
    root.style.setProperty('--font-scale', scaleMap[t.font_scale] || '16px');
  };

  const fetchTheme = async () => {
    try {
      const res = await API.get('/api/website/theme');
      if (res.data && Object.keys(res.data).length > 0) {
        setTheme(res.data);
        applyThemeVariables(res.data);
      } else {
        applyThemeVariables(theme);
      }
    } catch (err) {
      console.error('Error fetching theme settings:', err);
      applyThemeVariables(theme);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  const updateLocalThemePreview = (newTheme) => {
    setTheme(newTheme);
    applyThemeVariables(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fetchTheme, updateLocalThemePreview, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
