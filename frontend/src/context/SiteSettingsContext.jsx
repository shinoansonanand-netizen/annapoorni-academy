import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: 'Annapoorni Academy',
    tagline: 'Empowering Minds, Shaping Futures',
    site_description: 'Annapoorni Academy is a premier educational platform.',
    logo_url: '',
    favicon_url: ''
  });
  const [navigation, setNavigation] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [contactInfo, setContactInfo] = useState({});
  const [seoInfo, setSeoInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSiteDetails = async () => {
    try {
      const [resSet, resNav, resSoc, resCon, resSeo] = await Promise.all([
        API.get('/api/website/settings'),
        API.get('/api/navigation'),
        API.get('/api/social-links'),
        API.get('/api/contact'),
        API.get('/api/seo')
      ]);

      if (resSet.data) setSettings(resSet.data);
      if (resNav.data) setNavigation(resNav.data);
      if (resSoc.data) setSocialLinks(resSoc.data);
      if (resCon.data) setContactInfo(resCon.data);
      if (resSeo.data) setSeoInfo(resSeo.data);
    } catch (err) {
      console.error('Error loading site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteDetails();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{
      settings,
      navigation,
      socialLinks,
      contactInfo,
      seoInfo,
      fetchSiteDetails,
      loading
    }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
