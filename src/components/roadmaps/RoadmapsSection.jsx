import React, { useState, useMemo } from 'react';
import RoadmapCard from './RoadmapCard';
import { roadmapsData } from '../../data/roadmapsData';
import { siteConfig } from '../../data/siteConfig';
import { sfx } from '../../utils/soundEffects';
import { useLanguage } from '../../context/LanguageContext';

export default function RoadmapsSection({ onOpenRoadmap }) {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRoadmaps = useMemo(() => {
    return roadmapsData.filter((roadmap) => {
      // 1. Category Filter
      const matchesCategory =
        selectedCategory === 'all' || roadmap.category === selectedCategory;

      // 2. Search Query Filter
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchesTitle = roadmap.title.toLowerCase().includes(q);
      const matchesDesc = roadmap.desc.toLowerCase().includes(q);
      const matchesTags = (roadmap.tags || []).some((tag) =>
        tag.toLowerCase().includes(q)
      );

      return matchesCategory && (matchesTitle || matchesDesc || matchesTags);
    });
  }, [searchQuery, selectedCategory]);

  const handleCategoryClick = (catId) => {
    sfx.playClick();
    setSelectedCategory(catId);
  };

  const handleResetFilters = () => {
    sfx.playClick();
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <section id="roadmaps">
      <div className="container-xl">
        <div className="roadmaps-header-wrap reveal-on-scroll">
          <div className="section-kicker">{t('roadmaps', 'kicker', '01 / Roadmaps Explorer')}</div>
          <h2 className="section-title">
            {t('roadmaps', 'title', 'Pick your')}{' '}
            <span className="gradient">{t('roadmaps', 'titleGradient', 'direction.')}</span>
          </h2>
          <p className="section-desc">
            {t('roadmaps', 'desc', 'Explore curated learning paths designed by Cipher mentors. Search by topic, filter by specialty, or browse all available roadmaps.')}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="roadmaps-controls-bar reveal-on-scroll">
          {/* Search Input */}
          <div className="search-box-wrap">
            <i className="fa-solid fa-magnifying-glass search-icon" />
            <input
              type="text"
              className="roadmap-search-input"
              placeholder={t('roadmaps', 'searchPlaceholder', 'Search by path, tech, or skill (e.g. React, Docker, Logic)...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search roadmaps"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="category-pills-row" role="tablist" aria-label="Filter roadmaps by category">
            {siteConfig.categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const catLabel = t('categories', cat.id, cat.label);
              return (
                <button
                  key={cat.id}
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                  role="tab"
                  aria-selected={isActive}
                >
                  <i className={`fa-solid ${cat.icon}`} />
                  <span>{catLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filters Tag */}
        <div className="roadmaps-status-row">
          <span className="results-count-badge">
            <i className="fa-solid fa-layer-group" />
            {t('roadmaps', 'showing', 'Showing')}{' '}
            <b>{filteredRoadmaps.length}</b>{' '}
            {t('roadmaps', 'of', 'of')}{' '}
            {roadmapsData.length}{' '}
            {t('roadmaps', 'pathsCount', 'paths')}
          </span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              className="reset-filters-btn"
              onClick={handleResetFilters}
            >
              <i className="fa-solid fa-arrow-rotate-left" /> {t('roadmaps', 'resetFilters', 'Reset Filters')}
            </button>
          )}
        </div>

        {/* Roadmaps Grid or Empty State */}
        {filteredRoadmaps.length > 0 ? (
          <div className="roadmap-grid reveal-stagger">
            {filteredRoadmaps.map((roadmap, index) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                index={index}
                onOpenRoadmap={(r, tab) => {
                  sfx.playActivate();
                  onOpenRoadmap(r, tab);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="roadmaps-empty-state">
            <div className="empty-icon-wrap">
              <i className="fa-solid fa-radar" />
            </div>
            <h3>{t('roadmaps', 'noMatchTitle', 'No matching roadmaps found')}</h3>
            <p>
              {t('roadmaps', 'noMatchDesc', "We couldn't find any path matching")} "<b>{searchQuery}</b>"{' '}
              {t('roadmaps', 'noMatchDescEnd', 'in this category. Try adjusting your search keywords or reset filters.')}
            </p>
            <button className="btn-main" onClick={handleResetFilters}>
              <i className="fa-solid fa-arrow-rotate-left" /> {t('roadmaps', 'showAllBtn', 'Show All Roadmaps')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
