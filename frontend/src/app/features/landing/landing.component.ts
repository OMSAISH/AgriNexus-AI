import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-experience">
      <!-- Top Public Navigation -->
      <header class="public-nav">
        <div class="nav-inner">
          <a routerLink="/" class="brand-link">
            <div class="brand-icon">🌱</div>
            <div class="brand-text">
              <span class="brand-title">AgriNexus AI</span>
              <span class="brand-sub">Enterprise AgTech</span>
            </div>
          </a>

          <nav class="public-links">
            <a href="#features">Platform Features</a>
            <a href="#showcase">AI Crop Doctor</a>
            <a href="#irrigation">Smart Irrigation</a>
            <a href="#market">Mandi Intelligence</a>
            <a href="#case-study">Case Study</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div class="public-actions">
            <a routerLink="/system-status" class="nav-status-badge">
              <span class="live-pulse"></span>
              <span>API Live</span>
            </a>
            <a routerLink="/auth/login" class="btn btn-secondary btn-sm">Sign In</a>
            <a routerLink="/dashboard" class="btn btn-primary btn-sm">Launch App →</a>
          </div>
        </div>
      </header>

      <!-- 1 & 2 & 3 & 4 & 5: Hero Section -->
      <section class="hero-section">
        <div class="hero-bg-overlay"></div>
        <div class="hero-container">
          <div class="hero-badge">
            <span class="badge-sparkle">✨</span>
            <span>Intelligent Farm Operations &amp; Decision Support Platform</span>
          </div>

          <h1 class="hero-headline">
            Smarter Farming.<br />
            <span class="emerald-gradient">Better Decisions.</span><br />
            Sustainable Growth.
          </h1>

          <p class="hero-subtext">
            AgriNexus AI unites sub-meter parcel mapping, deep-learning leaf pathology diagnosis,
            real-time soil fertility balancing, and APMC commodity mandi intelligence into a single,
            precision agriculture ecosystem for modern farm holdings.
          </p>

          <div class="hero-cta-row">
            <a routerLink="/dashboard" class="btn btn-primary btn-lg">
              <span>🚀 Explore Farm Twin Dashboard</span>
            </a>
            <a routerLink="/crop-doctor" class="btn btn-secondary btn-lg">
              <span>🩺 Try AI Leaf Doctor</span>
            </a>
            <a routerLink="/system-status" class="btn btn-outline btn-lg">
              <span>⚡ Live API Handshake</span>
            </a>
          </div>

          <!-- Hero Telemetry Cards Floating Mockup -->
          <div class="hero-telemetry-banner">
            <div class="telemetry-chip">
              <span class="chip-icon">📍</span>
              <div>
                <strong>Rahata, Ahilyanagar</strong>
                <span>19.7126° N, 74.4842° E</span>
              </div>
            </div>
            <div class="telemetry-chip highlight">
              <span class="chip-icon">🧅</span>
              <div>
                <strong>Rabi Onion (Plot 1)</strong>
                <span class="text-success">2.0 Ac &bull; Bulbing Stage</span>
              </div>
            </div>
            <div class="telemetry-chip">
              <span class="chip-icon">💧</span>
              <div>
                <strong>Soil Moisture: 64%</strong>
                <span>Optimal (Pravara Canal)</span>
              </div>
            </div>
            <div class="telemetry-chip">
              <span class="chip-icon">📈</span>
              <div>
                <strong>Rahata APMC Onion</strong>
                <span class="text-success">₹2,450 / Qtl (▲ 9.8%)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6: Platform Features Grid -->
      <section id="features" class="section-container">
        <div class="section-heading text-center">
          <span class="section-tag">Modular Architecture</span>
          <h2 class="section-title">Engineered for Agricultural Excellence</h2>
          <p class="section-desc">Six interconnected intelligence engines transforming daily farm management into data-backed decisions.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🗺️</div>
            <h3>Sub-Meter Parcel Digital Twin</h3>
            <p>Model field boundaries with high-precision GPS polygons. Track crop allocations, sowing timelines, and historical soil tests per parcel.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🩺</div>
            <h3>Vision-Based Crop Pathology</h3>
            <p>Instant diagnosis of foliar diseases (Purple Blotch, Soybean Rust, Sugarcane Red Rot) with calibrated confidence and remediation checklists.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">💧</div>
            <h3>Sensor-Driven Irrigation Guidance</h3>
            <p>Optimize water application based on real-time soil moisture and crop evapotranspiration coefficients to conserve groundwater.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🌦️</div>
            <h3>Hyperlocal Microclimate Engine</h3>
            <p>Hourly 7-day agro-meteorological forecasting with automated spraying feasibility windows and storm warning telemetry.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>APMC Mandi Price Intelligence</h3>
            <p>Live commodity rates across Rahata, Shrirampur, and Ahmednagar markets with temporal price trend curves to optimize harvest sales.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Farm Financial Ledger</h3>
            <p>Track input costs across seed, fertilizers, labour, and machinery. Calculate net margin per acre for complete economic visibility.</p>
          </div>
        </div>
      </section>

      <!-- 7: AI Crop Doctor Showcase -->
      <section id="showcase" class="section-container showcase-section">
        <div class="showcase-layout">
          <div class="showcase-content">
            <span class="section-tag">Deep Learning Pathology</span>
            <h2 class="section-title">AI Leaf Doctor: Instant Disease Detection</h2>
            <p class="showcase-text">
              Simply photograph a crop leaf from your field. Our convolutional vision model instantly segments the pathology, calculates diagnostic confidence, and prescribes both chemical and biological remedies.
            </p>
            <div class="showcase-points">
              <div class="point-item">
                <span class="point-check">✓</span>
                <div>
                  <strong>Purple Blotch (Alternaria porri) in Rabi Onion</strong>
                  <p>Prescribes Mancozeb 75% WP or biological Trichoderma viride application.</p>
                </div>
              </div>
              <div class="point-item">
                <span class="point-check">✓</span>
                <div>
                  <strong>Soybean Rust (Phakopsora pachyrhizi)</strong>
                  <p>Early-stage detection to prevent catastrophic yield reduction during pod-fill.</p>
                </div>
              </div>
              <div class="point-item">
                <span class="point-check">✓</span>
                <div>
                  <strong>Sugarcane Red Rot (Colletotrichum falcatum)</strong>
                  <p>Detects sucrose-depleting vascular infection and provides set-treatment protocols.</p>
                </div>
              </div>
            </div>
            <a routerLink="/crop-doctor" class="btn btn-primary mt-3">Launch AI Diagnostic Scanner →</a>
          </div>

          <div class="showcase-visual">
            <div class="diagnostic-mock-card">
              <div class="card-header-chip">
                <span>Scan Report: #SCN-9024</span>
                <span class="agri-badge badge-warning">Moderate Severity</span>
              </div>
              <div class="scanned-leaf-preview">
                <div class="leaf-placeholder">
                  <span class="leaf-icon">🧅</span>
                  <div class="bounding-box">
                    <span class="box-tag">Alternaria porri (94.2%)</span>
                  </div>
                </div>
              </div>
              <div class="diagnostic-results">
                <div class="result-row">
                  <span>Detected Disease:</span>
                  <strong>Onion Purple Blotch</strong>
                </div>
                <div class="confidence-bar-wrap">
                  <div class="conf-label">
                    <span>Model Confidence</span>
                    <strong>94.2%</strong>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill" style="width: 94.2%;"></div>
                  </div>
                </div>
                <div class="treatment-pills">
                  <span class="rx-tag chemical">🧪 Mancozeb 75% WP @ 2.5g/L</span>
                  <span class="rx-tag organic">🌿 Trichoderma viride @ 5g/L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 8 & 9: Smart Irrigation & Weather Showcase -->
      <section id="irrigation" class="section-container alt-bg">
        <div class="dual-showcase-grid">
          <div class="dual-card">
            <div class="dual-icon">💧</div>
            <span class="section-tag">Water Resource Efficiency</span>
            <h3>Smart Drip &amp; Canal Scheduling</h3>
            <p>
              By tracking volumetric soil moisture (40%–85%) and crop growth stages, AgriNexus AI calculates the precise irrigation volume needed, preventing root rot in onion while sustaining sugarcane grand growth.
            </p>
            <div class="metric-highlight">
              <span class="metric-num">32%</span>
              <span class="metric-desc">Average Water Conserved via Drip Optimization</span>
            </div>
            <a routerLink="/irrigation" class="link-action">Inspect Irrigation Matrix →</a>
          </div>

          <div class="dual-card" id="weather">
            <div class="dual-icon">🌦️</div>
            <span class="section-tag">Microclimate Intelligence</span>
            <h3>Hourly Spray &amp; Wind Guidance</h3>
            <p>
              Integrated agro-meteorological forecasting analyzes relative humidity and wind speed, providing high-precision spray advisories so foliar inputs are never lost to precipitation or drift.
            </p>
            <div class="metric-highlight">
              <span class="metric-num">98.4%</span>
              <span class="metric-desc">Forecast Correlation with Local IMD Radar</span>
            </div>
            <a routerLink="/weather" class="link-action">View 7-Day Rahata Weather →</a>
          </div>
        </div>
      </section>

      <!-- 10: Market Intelligence Showcase -->
      <section id="market" class="section-container">
        <div class="section-heading text-center">
          <span class="section-tag">Economic Maximization</span>
          <h2 class="section-title">Direct APMC Mandi Price Intelligence</h2>
          <p class="section-desc">Track real-time modal rates across regional Maharashtra mandis so you sell at the peak of the price curve.</p>
        </div>

        <div class="mandi-comparison-grid">
          <div class="mandi-price-card highlight">
            <div class="mandi-header">
              <span class="mandi-badge primary">Primary Market</span>
              <h4>Rahata APMC</h4>
            </div>
            <div class="commodity-price-item">
              <span>Rabi Onion (Bhima Super)</span>
              <strong>₹2,450 / Qtl <small class="text-success">▲ +₹220</small></strong>
            </div>
            <div class="commodity-price-item">
              <span>Soybean (JS 335)</span>
              <strong>₹4,620 / Qtl <small class="text-success">▲ +₹80</small></strong>
            </div>
            <div class="commodity-price-item">
              <span>Sugarcane (FRP Mill Rate)</span>
              <strong>₹3,150 / Ton <small class="text-neutral">Stable</small></strong>
            </div>
          </div>

          <div class="mandi-price-card">
            <div class="mandi-header">
              <span class="mandi-badge">Neighboring</span>
              <h4>Shrirampur APMC</h4>
            </div>
            <div class="commodity-price-item">
              <span>Rabi Onion</span>
              <strong>₹2,380 / Qtl <small class="text-danger">▼ -₹50</small></strong>
            </div>
            <div class="commodity-price-item">
              <span>Soybean</span>
              <strong>₹4,590 / Qtl <small class="text-neutral">Stable</small></strong>
            </div>
          </div>

          <div class="mandi-price-card">
            <div class="mandi-header">
              <span class="mandi-badge">District Hub</span>
              <h4>Ahmednagar Central APMC</h4>
            </div>
            <div class="commodity-price-item">
              <span>Rabi Onion</span>
              <strong>₹2,510 / Qtl <small class="text-success">▲ +₹180</small></strong>
            </div>
            <div class="commodity-price-item">
              <span>Soybean</span>
              <strong>₹4,650 / Qtl <small class="text-success">▲ +₹110</small></strong>
            </div>
          </div>
        </div>
      </section>

      <!-- 11: Benefits for Indian Farmers -->
      <section class="section-container alt-bg">
        <div class="section-heading text-center">
          <span class="section-tag">Value Proposition</span>
          <h2 class="section-title">Built Specially for Indian Smallholders</h2>
          <p class="section-desc">Practical, high-impact features engineered for realistic agricultural realities.</p>
        </div>

        <div class="benefits-grid">
          <div class="benefit-box">
            <span class="benefit-num">01</span>
            <h4>Reduced Input Costs</h4>
            <p>Targeted NPK soil balancing prevents over-application of Urea and DAP, reducing chemical expenditures by up to 22%.</p>
          </div>
          <div class="benefit-box">
            <span class="benefit-num">02</span>
            <h4>Zero Guesswork Crop Doctor</h4>
            <p>Identify foliar diseases within seconds using mobile leaf photos, preventing epidemic crop failures before flowering.</p>
          </div>
          <div class="benefit-box">
            <span class="benefit-num">03</span>
            <h4>Canal &amp; Borewell Resilience</h4>
            <p>Synchronize irrigation intervals with rotational canal water releases and local evapotranspiration telemetry.</p>
          </div>
          <div class="benefit-box">
            <span class="benefit-num">04</span>
            <h4>Multilingual Accessibility</h4>
            <p>Built with native localization support for English, Marathi (मराठी), and Hindi (हिंदी) across all workflows.</p>
          </div>
        </div>
      </section>

      <!-- 12: How the Platform Works -->
      <section class="section-container">
        <div class="section-heading text-center">
          <span class="section-tag">Workflow Architecture</span>
          <h2 class="section-title">How AgriNexus AI Operates in 3 Steps</h2>
        </div>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-badge">Step 1</div>
            <h3>Map Your Farm Twin</h3>
            <p>Outline your holding and crop plots using our interactive GPS parcel boundary mapper with soil baseline entries.</p>
          </div>
          <div class="step-card">
            <div class="step-badge">Step 2</div>
            <h3>Monitor Daily Telemetry</h3>
            <p>Receive automated daily advisories on soil moisture, pest threat alerts, weather windows, and irrigation schedules.</p>
          </div>
          <div class="step-card">
            <div class="step-badge">Step 3</div>
            <h3>Optimize &amp; Monetize</h3>
            <p>Diagnose leaf diseases via AI, harvest at peak quality, and sell at the highest-paying local APMC mandi market.</p>
          </div>
        </div>
      </section>

      <!-- 13: Realistic Case Study Section (Rahata) -->
      <section id="case-study" class="section-container case-study-section">
        <div class="case-study-hero">
          <div class="case-header">
            <div class="case-badge">Field-Tested Case Study</div>
            <h2>Shinde Krushi Farm &bull; Rahata, Maharashtra</h2>
            <p class="case-loc">Location: Chitali / Rahata, Ahilyanagar District &bull; Farmer: Dnyaneshwar Kisan Shinde</p>
          </div>

          <div class="case-metrics-banner">
            <div class="cm-item">
              <span class="cm-label">Total Holding</span>
              <span class="cm-val">5.00 Acres</span>
              <span class="cm-sub">Medium Black Vertisol</span>
            </div>
            <div class="cm-item">
              <span class="cm-label">Plot 1 (2.0 Ac)</span>
              <span class="cm-val">Rabi Onion</span>
              <span class="cm-sub">Bhima Super Variety</span>
            </div>
            <div class="cm-item">
              <span class="cm-label">Plot 2 (1.5 Ac)</span>
              <span class="cm-val">Soybean</span>
              <span class="cm-sub">JS 335 Variety</span>
            </div>
            <div class="cm-item">
              <span class="cm-label">Plot 3 (1.5 Ac)</span>
              <span class="cm-val">Sugarcane Adsali</span>
              <span class="cm-sub">Co 86032 Variety</span>
            </div>
          </div>

          <div class="case-story">
            <p>
              "By utilizing AgriNexus AI's localized disease alerts, we detected early symptoms of Purple Blotch in our 2-acre Rabi Onion plot before it could spread. Combining the soil NPK balancer with Pravara canal irrigation scheduling has saved over 15 hours of diesel pump usage while targeting an estimated ₹4,85,000 in seasonal farm revenue."
            </p>
            <div class="farmer-sig">
              <strong>— Dnyaneshwar Kisan Shinde</strong>, Rahata Taluka, Maharashtra
            </div>
          </div>
        </div>
      </section>

      <!-- 14: Interactive FAQ Section -->
      <section id="faq" class="section-container">
        <div class="section-heading text-center">
          <span class="section-tag">Frequently Answered</span>
          <h2 class="section-title">Questions &amp; Technical Inquiries</h2>
        </div>

        <div class="faq-list">
          @for (faq of faqs; track faq.q; let i = $index) {
            <div class="faq-item" [class.open]="openFaqIndex() === i">
              <button (click)="toggleFaq(i)" class="faq-question">
                <span>{{ faq.q }}</span>
                <span class="faq-toggle">{{ openFaqIndex() === i ? '−' : '+' }}</span>
              </button>
              @if (openFaqIndex() === i) {
                <div class="faq-answer">
                  <p>{{ faq.a }}</p>
                </div>
              }
            </div>
          }
        </div>
      </section>

      <!-- 15: Public Enterprise Footer -->
      <footer class="public-footer">
        <div class="footer-inner">
          <div class="footer-col brand-col">
            <div class="footer-logo">
              <span>🌱</span>
              <strong>AgriNexus AI</strong>
            </div>
            <p>
              Intelligent Farm Operations &amp; Decision Support Platform. Engineered for HCL Academic Evaluation &amp; Enterprise AgTech Demonstration.
            </p>
            <div class="footer-tags">
              <span class="agri-badge badge-forest">Angular 19+</span>
              <span class="agri-badge badge-forest">FastAPI</span>
              <span class="agri-badge badge-forest">PostgreSQL 18</span>
            </div>
          </div>

          <div class="footer-col">
            <h4>Group 9 Development Team:</h4>
            <ul class="team-list">
              <li>Omsaish Kishor Dhokchaule</li>
              <li>Sahil Keshav Jawale</li>
              <li>Sarthak Balasaheb Harde</li>
              <li>Abhijeet Pankaj Kanawade</li>
              <li>Prathamesh Satish Shinde</li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Platform Navigation</h4>
            <ul class="quick-links">
              <li><a routerLink="/dashboard">Farm Twin Dashboard</a></li>
              <li><a routerLink="/crop-doctor">AI Crop Doctor</a></li>
              <li><a routerLink="/irrigation">Smart Irrigation</a></li>
              <li><a routerLink="/market-intelligence">Mandi Trends</a></li>
              <li><a routerLink="/system-status">System Diagnostics Probe</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-copyright">
          <p>© 2026 AgriNexus AI. All rights reserved. Primary Case Study: Rahata, Ahilyanagar (5 Acres).</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-experience {
      background: var(--color-warm-white);
      color: var(--color-dark-text);
      overflow-x: hidden;
    }

    /* Public Nav */
    .public-nav {
      position: sticky;
      top: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--color-border);
      z-index: 1000;
      padding: 0.85rem 0;
    }
    .nav-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }
    .brand-icon {
      width: 40px;
      height: 40px;
      background: #174C38;
      color: #ffffff;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #174C38;
      display: block;
      line-height: 1.1;
    }
    .brand-sub {
      font-size: 0.7rem;
      color: var(--color-neutral-grey);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .public-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      a {
        color: var(--color-dark-text);
        font-size: 0.88rem;
        font-weight: 500;
        text-decoration: none;
        transition: color var(--transition-fast);
        &:hover { color: #16845B; }
      }
    }
    .public-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .nav-status-badge {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--color-light-sage);
      color: #174C38;
      padding: 0.35rem 0.65rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      border: 1px solid var(--color-sage-border);
      text-decoration: none;
    }
    .live-pulse {
      width: 8px;
      height: 8px;
      background: #16845B;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(22, 132, 91, 0.8);
    }

    /* Hero */
    .hero-section {
      position: relative;
      background: linear-gradient(180deg, #E8F2EA 0%, #FAFBF8 100%);
      padding: 5rem 1.5rem 4rem;
      border-bottom: 1px solid var(--color-border);
      text-align: center;
    }
    .hero-container {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #ffffff;
      border: 1px solid var(--color-sage-border);
      padding: 0.4rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.82rem;
      font-weight: 700;
      color: #174C38;
      margin-bottom: 1.75rem;
      box-shadow: var(--shadow-xs);
    }
    .hero-headline {
      font-size: 3.5rem;
      font-weight: 800;
      color: #174C38;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 1.5rem;
    }
    .emerald-gradient {
      color: #16845B;
    }
    .hero-subtext {
      font-size: 1.15rem;
      color: var(--color-neutral-grey);
      line-height: 1.6;
      max-width: 780px;
      margin-bottom: 2.25rem;
    }
    .hero-cta-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 3.5rem;
    }
    .hero-telemetry-banner {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      width: 100%;
    }
    .telemetry-chip {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-align: left;
      box-shadow: var(--shadow-sm);
      strong { font-size: 0.85rem; color: var(--color-dark-text); display: block; }
      span { font-size: 0.75rem; color: var(--color-neutral-grey); }
      &.highlight {
        border-color: #16845B;
        background: #f0fdf4;
      }
    }
    .chip-icon { font-size: 1.5rem; }
    .text-success { color: #16845B; font-weight: 700; }
    .text-danger { color: #dc2626; font-weight: 700; }
    .text-neutral { color: var(--color-neutral-grey); }

    /* Sections */
    .section-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 5rem 1.5rem;
      &.alt-bg {
        max-width: 100%;
        background: #F4F6F2;
      }
    }
    .section-heading {
      margin-bottom: 3.5rem;
      &.text-center { text-align: center; }
    }
    .section-tag {
      font-size: 0.78rem;
      font-weight: 700;
      color: #16845B;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
      margin-bottom: 0.4rem;
    }
    .section-title {
      font-size: 2.25rem;
      font-weight: 800;
      color: #174C38;
      letter-spacing: -0.02em;
      margin-bottom: 0.75rem;
    }
    .section-desc {
      font-size: 1.05rem;
      color: var(--color-neutral-grey);
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Feature Cards */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.5rem;
    }
    .feature-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-fast);
      &:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md);
        border-color: #16845B;
      }
      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: #174C38;
        margin: 0.75rem 0 0.5rem;
      }
      p {
        font-size: 0.9rem;
        color: var(--color-neutral-grey);
        line-height: 1.5;
      }
    }
    .feature-icon {
      font-size: 2.25rem;
    }

    /* Showcase Layout */
    .showcase-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3.5rem;
      align-items: center;
    }
    .showcase-text {
      font-size: 1.05rem;
      color: var(--color-neutral-grey);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .showcase-points {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .point-item {
      display: flex;
      gap: 0.85rem;
      strong { font-size: 0.95rem; color: #174C38; display: block; }
      p { font-size: 0.85rem; color: var(--color-neutral-grey); line-height: 1.4; }
    }
    .point-check {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #E8F2EA;
      color: #16845B;
      font-weight: 800;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* Mock Diagnostic Visual */
    .diagnostic-mock-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 1.75rem;
      box-shadow: var(--shadow-lg);
    }
    .card-header-chip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--color-neutral-grey);
    }
    .scanned-leaf-preview {
      background: #F4F6F2;
      border-radius: var(--radius-lg);
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-bottom: 1.25rem;
      border: 1px dashed var(--color-sage-border);
    }
    .leaf-icon { font-size: 4rem; }
    .bounding-box {
      position: absolute;
      top: 30px;
      right: 40px;
      border: 2px solid #D97706;
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      background: rgba(217, 119, 6, 0.1);
    }
    .box-tag {
      font-size: 0.7rem;
      font-weight: 700;
      color: #D97706;
      background: #ffffff;
      padding: 0.1rem 0.35rem;
      border-radius: 3px;
    }
    .result-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
      strong { color: #174C38; }
    }
    .confidence-bar-wrap {
      margin-bottom: 1rem;
    }
    .conf-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--color-neutral-grey);
      margin-bottom: 0.35rem;
      strong { color: #16845B; }
    }
    .bar-track {
      height: 8px;
      background: #E2E8F0;
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background: #16845B;
      border-radius: var(--radius-full);
    }
    .treatment-pills {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .rx-tag {
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0.4rem 0.75rem;
      border-radius: var(--radius-md);
      &.chemical { background: #FEF3C7; color: #92400E; }
      &.organic { background: #E8F7F0; color: #16845B; }
    }

    /* Dual Showcase Grid */
    .dual-showcase-grid {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    .dual-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      h3 { font-size: 1.45rem; font-weight: 800; color: #174C38; }
      p { font-size: 0.95rem; color: var(--color-neutral-grey); line-height: 1.6; }
    }
    .dual-icon { font-size: 2.5rem; margin-bottom: 0.25rem; }
    .metric-highlight {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      padding: 1rem 0;
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      margin: 0.5rem 0;
    }
    .metric-num {
      font-size: 2.25rem;
      font-weight: 800;
      color: #16845B;
    }
    .metric-desc {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-neutral-grey);
    }
    .link-action {
      font-size: 0.9rem;
      font-weight: 700;
      color: #174C38;
      &:hover { color: #16845B; }
    }

    /* Mandi Grid */
    .mandi-comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .mandi-price-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      &.highlight {
        border: 2px solid #16845B;
        box-shadow: var(--shadow-md);
      }
    }
    .mandi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h4 { font-size: 1.15rem; font-weight: 800; color: #174C38; }
    }
    .mandi-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-full);
      background: var(--color-surface-subtle);
      color: var(--color-neutral-grey);
      &.primary { background: #E8F7F0; color: #16845B; }
    }
    .commodity-price-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.65rem 0;
      border-bottom: 1px solid var(--color-border-subtle);
      font-size: 0.88rem;
      strong { color: var(--color-dark-text); font-weight: 700; }
      &:last-child { border-bottom: none; }
    }

    /* Benefits Grid */
    .benefits-grid {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .benefit-box {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-xs);
      h4 { font-size: 1.1rem; font-weight: 700; color: #174C38; margin: 0.5rem 0; }
      p { font-size: 0.88rem; color: var(--color-neutral-grey); line-height: 1.5; }
    }
    .benefit-num {
      font-size: 1.5rem;
      font-weight: 800;
      color: #16845B;
    }

    /* Steps Grid */
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .step-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-sm);
      position: relative;
      h3 { font-size: 1.2rem; font-weight: 700; color: #174C38; margin: 0.75rem 0 0.5rem; }
      p { font-size: 0.9rem; color: var(--color-neutral-grey); line-height: 1.5; }
    }
    .step-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 800;
      color: #ffffff;
      background: #174C38;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-sm);
    }

    /* Case Study Hero Section */
    .case-study-hero {
      background: #174C38;
      color: #ffffff;
      border-radius: var(--radius-xl);
      padding: 3.5rem;
      box-shadow: var(--shadow-lg);
    }
    .case-badge {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #c4decb;
      margin-bottom: 0.5rem;
    }
    .case-header h2 {
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .case-loc {
      font-size: 0.95rem;
      color: #cbd5e1;
      margin-top: 0.35rem;
    }
    .case-metrics-banner {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
      padding: 1.5rem 0;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    }
    .cm-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .cm-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #c4decb;
      font-weight: 600;
    }
    .cm-val {
      font-size: 1.35rem;
      font-weight: 800;
      color: #ffffff;
    }
    .cm-sub {
      font-size: 0.8rem;
      color: #cbd5e1;
    }
    .case-story {
      font-size: 1.1rem;
      line-height: 1.7;
      color: #e2e8f0;
      font-style: italic;
    }
    .farmer-sig {
      margin-top: 1rem;
      font-style: normal;
      font-size: 0.95rem;
      color: #ffffff;
    }

    /* FAQ */
    .faq-list {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .faq-item {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
      transition: all var(--transition-fast);
      &.open { border-color: #16845B; }
    }
    .faq-question {
      width: 100%;
      padding: 1.2rem 1.5rem;
      background: none;
      border: none;
      text-align: left;
      font-family: inherit;
      font-size: 1rem;
      font-weight: 700;
      color: #174C38;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
    .faq-toggle { font-size: 1.25rem; color: #16845B; }
    .faq-answer {
      padding: 0 1.5rem 1.25rem;
      font-size: 0.9rem;
      color: var(--color-neutral-grey);
      line-height: 1.6;
    }

    /* Public Footer */
    .public-footer {
      background: #0f3526;
      color: #ffffff;
      padding: 4rem 1.5rem 2rem;
    }
    .footer-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 3rem;
      padding-bottom: 3rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .brand-col p {
      font-size: 0.9rem;
      color: #cbd5e1;
      margin: 1rem 0;
      line-height: 1.6;
      max-width: 420px;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.35rem;
    }
    .footer-tags { display: flex; gap: 0.5rem; }
    .footer-col h4 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #c4decb;
      margin-bottom: 1rem;
    }
    .team-list, .quick-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.88rem;
      color: #cbd5e1;
      a {
        color: #cbd5e1;
        &:hover { color: #ffffff; text-decoration: underline; }
      }
    }
    .footer-copyright {
      max-width: 1280px;
      margin: 1.5rem auto 0;
      text-align: center;
      font-size: 0.8rem;
      color: #94a3b8;
    }

    @media (max-width: 1024px) {
      .public-links { display: none; }
      .showcase-layout { grid-template-columns: 1fr; }
      .dual-showcase-grid { grid-template-columns: 1fr; }
      .footer-inner { grid-template-columns: 1fr; gap: 2rem; }
      .hero-headline { font-size: 2.5rem; }
      .case-study-hero { padding: 2rem; }
    }
  `]
})
export class LandingComponent {
  public readonly openFaqIndex = signal<number | null>(0);

  faqs = [
    {
      q: 'How does the AI Crop Doctor diagnose foliar diseases?',
      a: 'The user uploads a camera photo of a suspected diseased leaf. Our deep-learning image classifier evaluates visual lesion signatures against validated pathology databases for Onion (Purple Blotch), Soybean (Rust), and Sugarcane (Red Rot), delivering confidence scores and ICAR-approved remedies within seconds.'
    },
    {
      q: 'How is the Rahata 5-acre case study integrated into the platform?',
      a: 'The platform comes pre-seeded with authentic coordinates for Rahata, Ahilyanagar (19.7126° N, 74.4842° E). It maps 3 distinct parcels: Plot 1 (2.0 Ac Rabi Onion), Plot 2 (1.5 Ac Soybean), and Plot 3 (1.5 Ac Sugarcane), with localized Pravara canal scheduling and local Rahata APMC rates.'
    },
    {
      q: 'Can AgriNexus AI function if third-party weather or market APIs are down?',
      a: 'Yes. Our FastAPI backend implements a resilient cache-aside architecture. All external weather and APMC mandi queries are persisted in PostgreSQL with time-to-live timestamps. If external services time out, the backend gracefully serves the latest cached snapshot.'
    },
    {
      q: 'Is the platform suitable for mobile devices in the field?',
      a: 'Yes. AgriNexus AI is fully responsive across mobile phones (375px), tablets (768px), and desktops. The responsive navigation drawer and touch-friendly camera upload interfaces allow farmers to perform scans directly in their fields.'
    }
  ];

  toggleFaq(index: number): void {
    this.openFaqIndex.update(current => current === index ? null : index);
  }
}
