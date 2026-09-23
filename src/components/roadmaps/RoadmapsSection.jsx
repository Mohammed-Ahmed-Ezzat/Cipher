import React, { useState, useMemo } from 'react';
import RoadmapCard from './RoadmapCard';
import { roadmapsData } from '../../data/roadmapsData';
import { siteConfig } from '../../data/siteConfig';
import { sfx } from '../../utils/soundEffects';
import { useLanguage } from '../../context/LanguageContext';

export default function RoadmapsSection({ onOpenRoadmap }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRoadmaps = useMemo(() => {
    if (selectedCategory === 'all') return roadmapsData;
    return roadmapsData.filter((roadmap) => roadmap.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (catId) => {
    sfx.playClick();
    setSelectedCategory(catId);
  };

  const handleResetFilters = () => {
    sfx.playClick();
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
            {t('roadmaps', 'desc', 'Explore curated learning paths designed by Cipher mentors. Filter by specialty or browse all available roadmaps.')}
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="roadmaps-controls-bar reveal-on-scroll">
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
          {selectedCategory !== 'all' && (
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
              {t('roadmaps', 'noMatchDesc', 'No roadmaps currently available in this track.')}
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
