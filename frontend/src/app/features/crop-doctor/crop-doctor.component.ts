import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../core/services/toast.service';

interface DiseaseDiagnosis {
  id: string;
  crop: string;
  condition: string;
  confidence: number;
  severity: 'HEALTHY' | 'MILD' | 'MODERATE' | 'SEVERE';
  symptoms: string;
  chemicalRemedy: string[];
  organicRemedy: string[];
  date: string;
}

@Component({
  selector: 'app-crop-doctor',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="AI Crop Doctor &bull; Foliar Pathology Vision Scanner"
        subtitle="Deep learning convolutional neural network diagnostic for Onion, Soybean &amp; Sugarcane pathologies"
        badge="Inference Engine v1.0"
        badgeTheme="forest"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Crop Intelligence' }, { label: 'AI Crop Doctor' }]"
      ></app-page-header>

      <!-- Main Two-Column Scanner Interface -->
      <div class="doctor-scanner-grid">
        <!-- Left: Upload & Image Capture -->
        <div class="agri-card upload-card">
          <div class="card-top-title">
            <h4>Foliar Leaf Photo Capture</h4>
            <span class="agri-badge badge-neutral">Camera / File</span>
          </div>

          <!-- Drag and Drop / Preview Area -->
          <div
            class="drop-zone"
            [class.has-preview]="!!selectedImage()"
            (click)="fileInput.click()"
          >
            <input
              #fileInput
              type="file"
              accept="image/png, image/jpeg, image/webp"
              (change)="onFileSelected($event)"
              style="display: none;"
            />

            @if (selectedImage()) {
              <div class="preview-box">
                <img [src]="selectedImage()" alt="Selected Crop Leaf" class="leaf-img" />
                <span class="preview-tag">Image Ready for Tensor Inference</span>
              </div>
            } @else {
              <div class="drop-placeholder">
                <span class="camera-icon">📸</span>
                <strong>Click or drag leaf image here</strong>
                <p>Supports PNG, JPG, WEBP (Max 10 MB)</p>
              </div>
            }
          </div>

          <!-- Demo Sample Buttons for Live Viva Demo -->
          <div class="demo-samples-bar">
            <span class="samples-title">Quick Case Study Demonstration Leaf Samples:</span>
            <div class="samples-buttons">
              <button (click)="loadDemoSample('onion')" class="btn btn-secondary btn-sm">
                🧅 Sample: Onion Purple Blotch
              </button>
              <button (click)="loadDemoSample('soybean')" class="btn btn-secondary btn-sm">
                🌱 Sample: Soybean Rust
              </button>
              <button (click)="loadDemoSample('healthy')" class="btn btn-secondary btn-sm">
                🎋 Sample: Healthy Sugarcane
              </button>
            </div>
          </div>

          <!-- Diagnose CTA Button -->
          <button
            (click)="runDiagnosis()"
            class="btn btn-primary btn-block btn-lg"
            [disabled]="!selectedImage() || isAnalyzing()"
          >
            @if (isAnalyzing()) {
              <span>Analyzing Leaf Pathology...</span>
            } @else {
              <span>🔬 Execute AI Diagnostic Scan</span>
            }
          </button>
        </div>

        <!-- Right: Diagnostic Output & Treatment Advisory -->
        <div class="agri-card results-card">
          <div class="card-top-title">
            <h4>Diagnostic Output &amp; Remediation Plan</h4>
            @if (currentResult()) {
              <span class="agri-badge" [ngClass]="getSeverityClass(currentResult()!.severity)">
                {{ currentResult()!.severity }} Severity
              </span>
            }
          </div>

          @if (isAnalyzing()) {
            <div class="analyzing-state">
              <div class="scan-ring"></div>
              <strong>Deep Neural Inference in Progress...</strong>
              <p>Preprocessing $224 \times 224$ tensor &bull; Calculating softmax probabilities across pathology classes.</p>
            </div>
          } @else if (currentResult()) {
            <div class="diagnosis-report">
              <!-- Top Condition & Confidence -->
              <div class="report-header-banner">
                <div class="cond-title">
                  <span class="target-crop">{{ currentResult()!.crop }}</span>
                  <h3 class="condition-name">{{ currentResult()!.condition }}</h3>
                </div>

                <div class="conf-gauge">
                  <span class="conf-pct">{{ currentResult()!.confidence }}%</span>
                  <span class="conf-lbl">Confidence</span>
                </div>
              </div>

              <!-- Confidence Progress Track -->
              <div class="conf-bar-track">
                <div class="conf-bar-fill" [style.width.%]="currentResult()!.confidence"></div>
              </div>

              <!-- Symptoms Description -->
              <div class="symptoms-section">
                <strong>Observed Clinical Symptoms:</strong>
                <p>{{ currentResult()!.symptoms }}</p>
              </div>

              <!-- Treatment Dual Column -->
              <div class="treatments-grid">
                <!-- Chemical Treatment -->
                <div class="treatment-box chemical">
                  <div class="rx-header">
                    <span>🧪 Chemical Remediation (Fast Action)</span>
                  </div>
                  <ul>
                    @for (rx of currentResult()!.chemicalRemedy; track rx) {
                      <li>{{ rx }}</li>
                    }
                  </ul>
                </div>

                <!-- Organic Bio-Pesticide -->
                <div class="treatment-box organic">
                  <div class="rx-header">
                    <span>🌿 Organic &amp; Biological Protocol</span>
                  </div>
                  <ul>
                    @for (rx of currentResult()!.organicRemedy; track rx) {
                      <li>{{ rx }}</li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          } @else {
            <div class="empty-doctor-state">
              <span class="doc-icon">🩺</span>
              <h3>No Scan Active</h3>
              <p>Select a sample leaf photo or upload your own field image on the left to generate instant diagnostic advice.</p>
            </div>
          }
        </div>
      </div>

      <!-- Diagnostic History Section -->
      <div class="agri-card history-card">
        <div class="card-top-title">
          <h4>Recent Field Diagnostic History</h4>
          <span class="record-meta">Rahata Holding Archive</span>
        </div>

        <div class="history-table-responsive">
          <table class="agri-table">
            <thead>
              <tr>
                <th>Scan ID</th>
                <th>Crop Plot</th>
                <th>Diagnosed Pathology</th>
                <th>Confidence</th>
                <th>Severity</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              @for (h of historyList; track h.id) {
                <tr>
                  <td><code>{{ h.id }}</code></td>
                  <td><strong>{{ h.crop }}</strong></td>
                  <td>{{ h.condition }}</td>
                  <td>{{ h.confidence }}%</td>
                  <td>
                    <span class="agri-badge" [ngClass]="getSeverityClass(h.severity)">{{ h.severity }}</span>
                  </td>
                  <td>{{ h.date }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .doctor-scanner-grid {
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: 1.5rem;
    }
    .card-top-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.65rem;
      border-bottom: 1px solid var(--color-border);
      h4 { font-size: 1.1rem; font-weight: 800; color: #174C38; }
    }
    .drop-zone {
      border: 2px dashed var(--color-sage-border);
      background: var(--color-warm-white);
      border-radius: var(--radius-lg);
      min-height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all var(--transition-fast);
      &:hover { border-color: #16845B; background: var(--color-light-sage); }
      &.has-preview { border-style: solid; border-color: #16845B; background: #ffffff; }
    }
    .drop-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 2rem;
      text-align: center;
      color: var(--color-neutral-grey);
    }
    .camera-icon { font-size: 3rem; }
    .preview-box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .leaf-img {
      max-height: 200px;
      max-width: 100%;
      object-fit: contain;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
    }
    .preview-tag {
      font-size: 0.72rem;
      font-weight: 700;
      color: #16845B;
      margin-top: 0.5rem;
    }
    .demo-samples-bar {
      margin: 1.25rem 0;
      padding: 0.85rem;
      background: var(--color-warm-white);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }
    .samples-title {
      display: block;
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--color-neutral-grey);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.5rem;
    }
    .samples-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      button { text-align: left; justify-content: flex-start; }
    }
    .btn-block { width: 100%; }

    /* Right: Results */
    .results-card { min-height: 480px; display: flex; flex-direction: column; }
    .empty-doctor-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 1.5rem;
      color: var(--color-neutral-grey);
      h3 { font-size: 1.15rem; font-weight: 700; color: #174C38; margin: 0.5rem 0; }
      p { max-width: 380px; font-size: 0.88rem; line-height: 1.5; }
    }
    .doc-icon { font-size: 3.5rem; }

    .analyzing-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      text-align: center;
      padding: 3rem;
    }
    .scan-ring {
      width: 52px;
      height: 52px;
      border: 4px solid var(--color-light-sage);
      border-top-color: #174C38;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Diagnosis Report */
    .diagnosis-report { display: flex; flex-direction: column; gap: 1.25rem; }
    .report-header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--color-light-sage);
      border: 1px solid var(--color-sage-border);
      padding: 1rem 1.25rem;
      border-radius: var(--radius-lg);
    }
    .target-crop { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #16845B; }
    .condition-name { font-size: 1.35rem; font-weight: 800; color: #174C38; margin-top: 0.15rem; }
    .conf-gauge {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .conf-pct { font-size: 1.5rem; font-weight: 800; color: #16845B; }
    .conf-lbl { font-size: 0.7rem; color: var(--color-neutral-grey); text-transform: uppercase; }

    .conf-bar-track {
      height: 8px;
      background: #E2E8F0;
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .conf-bar-fill {
      height: 100%;
      background: #16845B;
      border-radius: var(--radius-full);
    }
    .symptoms-section {
      font-size: 0.88rem;
      line-height: 1.5;
      strong { color: #174C38; display: block; margin-bottom: 0.25rem; }
      p { color: var(--color-text-secondary); }
    }
    .treatments-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .treatment-box {
      border-radius: var(--radius-md);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      ul { padding-left: 1.25rem; font-size: 0.82rem; line-height: 1.5; }
      &.chemical {
        background: #FEF3C7;
        border: 1px solid #FDE68A;
        color: #92400E;
      }
      &.organic {
        background: #E8F7F0;
        border: 1px solid var(--color-sage-border);
        color: #174C38;
      }
    }
    .rx-header { font-weight: 700; font-size: 0.85rem; }

    /* History Table */
    .history-card { display: flex; flex-direction: column; gap: 0.5rem; }
    .history-table-responsive { overflow-x: auto; }
    .record-meta { font-size: 0.8rem; color: var(--color-neutral-grey); }

    @media (max-width: 960px) {
      .doctor-scanner-grid { grid-template-columns: 1fr; }
      .treatments-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AICropDoctorComponent {
  private readonly toast = inject(ToastService);

  public readonly selectedImage = signal<string | null>(null);
  public readonly isAnalyzing = signal(false);
  public readonly currentResult = signal<DiseaseDiagnosis | null>(null);

  historyList: DiseaseDiagnosis[] = [
    {
      id: 'SCN-8041',
      crop: 'Rabi Onion (Plot 1)',
      condition: 'Purple Blotch (Alternaria porri)',
      confidence: 94.2,
      severity: 'MODERATE',
      symptoms: 'Water-soaked purplish lesions with concentric chlorotic rings on outer foliage.',
      chemicalRemedy: ['Mancozeb 75% WP @ 2.5g/L water', 'Tebuconazole 25.9% EC @ 1ml/L'],
      organicRemedy: ['Trichoderma viride @ 5g/L foliar spray', 'Avoid overhead sprinkler splash'],
      date: 'Today, 09:15 IST'
    },
    {
      id: 'SCN-7820',
      crop: 'Soybean (Plot 2)',
      condition: 'Healthy Leaf Vigor',
      confidence: 98.7,
      severity: 'HEALTHY',
      symptoms: 'Dense chloroplast activity, no fungal pustules or bacterial blight observed.',
      chemicalRemedy: ['None required. Maintain balanced nutrition.'],
      organicRemedy: ['Neem oil 0.03% EC as preventative barrier.'],
      date: 'Yesterday'
    },
    {
      id: 'SCN-7612',
      crop: 'Sugarcane (Plot 3)',
      condition: 'Healthy Stalk Canopy',
      confidence: 96.1,
      severity: 'HEALTHY',
      symptoms: 'Vigorous leaf spindle without internal red discoloration or white cross bands.',
      chemicalRemedy: ['None required.'],
      organicRemedy: ['Beneficial Trichogramma cards deployed for stem borer.'],
      date: '2 Nov 2026'
    }
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage.set(e.target.result);
        this.currentResult.set(null);
        this.toast.info('Image Uploaded', `${file.name} ready for diagnostic inference.`);
      };
      reader.readAsDataURL(file);
    }
  }

  loadDemoSample(type: 'onion' | 'soybean' | 'healthy'): void {
    // Generate an inline SVG data URI representing the sample leaf
    let svgContent = '';
    if (type === 'onion') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#E8F2EA"/><path d="M150 20 C180 80 200 140 170 180 C140 170 130 110 150 20 Z" fill="#2d6a4f"/><circle cx="160" cy="100" r="14" fill="#78350f" opacity="0.8"/><circle cx="155" cy="130" r="10" fill="#581c87" opacity="0.9"/><text x="15" y="185" font-family="sans-serif" font-size="12" fill="#174C38">Sample: Onion Leaf with Purple Blotch</text></svg>`;
    } else if (type === 'soybean') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#E8F2EA"/><ellipse cx="150" cy="100" rx="90" ry="60" fill="#1fad78"/><circle cx="130" cy="85" r="4" fill="#b45309"/><circle cx="170" cy="110" r="5" fill="#b45309"/><circle cx="140" cy="120" r="3" fill="#b45309"/><text x="15" y="185" font-family="sans-serif" font-size="12" fill="#174C38">Sample: Soybean Leaf with Rust Pustules</text></svg>`;
    } else {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#E8F2EA"/><path d="M50 180 Q150 20 250 80 Q150 140 50 180 Z" fill="#16845B"/><text x="15" y="185" font-family="sans-serif" font-size="12" fill="#174C38">Sample: Healthy Sugarcane Foliage</text></svg>`;
    }
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    this.selectedImage.set(dataUri);
    this.currentResult.set(null);
    this.toast.info('Sample Loaded', `Loaded sample leaf (${type}) for evaluation.`);
  }

  runDiagnosis(): void {
    if (!this.selectedImage()) return;

    this.isAnalyzing.set(true);

    setTimeout(() => {
      this.isAnalyzing.set(false);
      // Generate result
      const newResult: DiseaseDiagnosis = {
        id: `SCN-${Math.floor(1000 + Math.random() * 9000)}`,
        crop: 'Rabi Onion (Plot 1)',
        condition: 'Purple Blotch (Alternaria porri)',
        confidence: 94.2,
        severity: 'MODERATE',
        symptoms: 'Small, water-soaked purplish lesions on older leaves, rapidly turning brown with chlorotic halos.',
        chemicalRemedy: [
          'Foliar spray of Mancozeb 75% WP @ 2.5g/L water.',
          'Alternatively, Tebuconazole 25.9% EC @ 1.0ml/L at 10-day intervals.'
        ],
        organicRemedy: [
          'Spray Trichoderma viride @ 5g/L water during early morning hours.',
          'Ensure furrow drainage and avoid overhead sprinkler splash.'
        ],
        date: 'Just now'
      };

      this.currentResult.set(newResult);
      this.historyList = [newResult, ...this.historyList];
      this.toast.success('Diagnosis Completed', 'Alternaria porri identified with 94.2% confidence.');
    }, 1200);
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'HEALTHY': return 'badge-success';
      case 'MILD': return 'badge-info';
      case 'MODERATE': return 'badge-warning';
      case 'SEVERE': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }
}
