import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { ToastService } from '../../core/services/toast.service';
import { InventoryService } from '../../core/services/inventory.service';
import { FarmService } from '../../core/services/farm.service';
import { InventoryItem, LowStockAlert } from '../../core/models/agrinexus.models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatCardComponent, DataTableComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Farm Input Inventory &amp; Stock Reserves"
        subtitle="Agrochemicals, bio-fertilizers, certified seeds, and drip spares for Rahata holding"
        badge="PostgreSQL Synced"
        badgeTheme="forest"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Resources' }, { label: 'Inventory' }]"
      >
        <div header-actions class="header-actions-row">
          <button (click)="openAddModal()" class="btn btn-primary btn-sm">+ Add New Input Item</button>
          <button (click)="openTxModal()" class="btn btn-secondary btn-sm">⇄ Issue / Inward Stock</button>
        </div>
      </app-page-header>

      <!-- Stat Cards -->
      <div class="stat-row">
        <app-stat-card
          label="Total Inventory Value"
          [value]="'₹' + formatVal(totalStockValue())"
          subtext="On-Farm Shed Reserve"
          icon="📦"
          theme="forest"
        ></app-stat-card>
        <app-stat-card
          label="Stock Items"
          [value]="items().length.toString()"
          unit="SKUs"
          subtext="Nutrients, Seeds &amp; Spares"
          icon="🏷️"
          theme="emerald"
        ></app-stat-card>
        <app-stat-card
          label="Low Stock Alerts"
          [value]="lowStockAlerts().length.toString()"
          unit="Items"
          [subtext]="lowStockAlerts().length > 0 ? lowStockAlerts()[0].name + ' below threshold' : 'All items optimal'"
          icon="⚠️"
          [theme]="lowStockAlerts().length > 0 ? 'warning' : 'emerald'"
        ></app-stat-card>
        <app-stat-card
          label="Recent Audit"
          value="100%"
          unit="Synced"
          subtext="PostgreSQL Relational DB"
          icon="📅"
          theme="info"
        ></app-stat-card>
      </div>

      <!-- Inventory Table -->
      <div class="agri-card table-card">
        <div class="table-title-bar">
          <div>
            <h4>Farm Shed Input Catalog</h4>
            <p>Real-time tracked stock for 5-acre cultivation operations</p>
          </div>
          <div class="filter-pills">
            <button class="pill" [class.active]="currentCategory() === 'ALL'" (click)="setCategory('ALL')">All</button>
            <button class="pill" [class.active]="currentCategory() === 'FERTILIZER'" (click)="setCategory('FERTILIZER')">Fertilizers</button>
            <button class="pill" [class.active]="currentCategory() === 'SEEDS'" (click)="setCategory('SEEDS')">Seeds</button>
            <button class="pill" [class.active]="currentCategory() === 'PESTICIDE'" (click)="setCategory('PESTICIDE')">Pesticides</button>
            <button class="pill" [class.active]="currentCategory() === 'TOOL'" (click)="setCategory('TOOL')">Tools/Spares</button>
          </div>
        </div>

        <app-data-table
          [columns]="inventoryColumns"
          [data]="tableRows()"
          [hasRowActions]="true"
          (actionClicked)="onStockAction($event)"
        ></app-data-table>
      </div>

      <!-- Add Item Modal -->
      @if (showAddModal()) {
        <div class="modal-backdrop">
          <div class="agri-modal">
            <div class="modal-header">
              <h3>Add New Inventory Input</h3>
              <button (click)="showAddModal.set(false)" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Item Name *</label>
                <input type="text" [(ngModel)]="newItem.name" placeholder="e.g. 19:19:19 Soluble Fertilizer" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Category *</label>
                  <select [(ngModel)]="newItem.category" class="form-control">
                    <option value="FERTILIZER">Fertilizer</option>
                    <option value="SEEDS">Seeds</option>
                    <option value="PESTICIDE">Pesticide / Fungicide</option>
                    <option value="TOOL">Tool / Irrigation Spare</option>
                    <option value="FUEL">Fuel</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Unit *</label>
                  <select [(ngModel)]="newItem.unit" class="form-control">
                    <option value="KG">KG</option>
                    <option value="LITER">LITER</option>
                    <option value="BAG">BAG</option>
                    <option value="PACKET">PACKET</option>
                    <option value="NOS">NOS</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Initial Quantity *</label>
                  <input type="number" [(ngModel)]="newItem.current_stock" class="form-control" min="0" step="0.5" />
                </div>
                <div class="form-group">
                  <label>Reorder Alert Level *</label>
                  <input type="number" [(ngModel)]="newItem.reorder_level" class="form-control" min="0" step="0.5" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Unit Price (₹) *</label>
                  <input type="number" [(ngModel)]="newItem.unit_price" class="form-control" min="0" step="10" />
                </div>
                <div class="form-group">
                  <label>Supplier</label>
                  <input type="text" [(ngModel)]="newItem.supplier" placeholder="e.g. IFFCO Kendra, Rahata" class="form-control" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="showAddModal.set(false)" class="btn btn-secondary">Cancel</button>
              <button (click)="submitNewItem()" class="btn btn-primary" [disabled]="isSubmitting()">Save Item</button>
            </div>
          </div>
        </div>
      }

      <!-- Issue / Inward Stock Modal -->
      @if (showTxModal()) {
        <div class="modal-backdrop">
          <div class="agri-modal">
            <div class="modal-header">
              <h3>Log Inventory Stock Movement</h3>
              <button (click)="showTxModal.set(false)" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Select Item *</label>
                <select [(ngModel)]="txPayload.item_id" class="form-control">
                  @for (it of items(); track it.id) {
                    <option [value]="it.id">{{ it.name }} (Available: {{ it.current_stock }} {{ it.unit }})</option>
                  }
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Movement Type *</label>
                  <select [(ngModel)]="txPayload.transaction_type" class="form-control">
                    <option value="INWARD">INWARD (Stock Received / Purchased)</option>
                    <option value="OUTWARD">OUTWARD (Field Application / Usage)</option>
                    <option value="ADJUSTMENT">ADJUSTMENT (Audit Correction)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Quantity *</label>
                  <input type="number" [(ngModel)]="txPayload.quantity" class="form-control" min="0.1" step="0.5" />
                </div>
              </div>
              <div class="form-group">
                <label>Operation Notes / Application Details</label>
                <input type="text" [(ngModel)]="txPayload.notes" placeholder="e.g. Applied 2 Bags DAP in Plot 1 East Field" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="showTxModal.set(false)" class="btn btn-secondary">Cancel</button>
              <button (click)="submitTransaction()" class="btn btn-primary" [disabled]="isSubmitting()">Post Stock Entry</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .header-actions-row { display: flex; gap: 0.75rem; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }
    .table-card { display: flex; flex-direction: column; gap: 1rem; }
    .table-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      h4 { font-size: 1.15rem; font-weight: 800; color: #174C38; }
      p { font-size: 0.82rem; color: var(--color-neutral-grey); }
    }
    .filter-pills {
      display: flex;
      gap: 0.5rem;
      .pill {
        background: #F4F6F2;
        border: 1px solid var(--color-border);
        border-radius: 9999px;
        padding: 0.35rem 0.85rem;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--color-neutral-grey);
        cursor: pointer;
        transition: all 0.2s ease;
        &.active, &:hover {
          background: #174C38;
          color: #FFF;
          border-color: #174C38;
        }
      }
    }
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(3px);
    }
    .agri-modal {
      background: #FFF;
      border-radius: var(--radius-lg, 12px);
      width: 90%;
      max-width: 540px;
      padding: 1.5rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      h3 { font-size: 1.2rem; font-weight: 800; color: #174C38; }
      .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; }
    }
    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      label { font-size: 0.82rem; font-weight: 700; color: #172B24; }
      .form-control {
        padding: 0.6rem 0.8rem;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
        font-size: 0.88rem;
      }
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #E5E7EB;
    }
  `]
})
export class InventoryComponent implements OnInit {
  private readonly inventoryService = inject(InventoryService);
  private readonly farmService = inject(FarmService);
  private readonly toast = inject(ToastService);

  items = signal<InventoryItem[]>([]);
  lowStockAlerts = signal<LowStockAlert[]>([]);
  currentCategory = signal<string>('ALL');
  farmId = signal<string>('');

  showAddModal = signal<boolean>(false);
  showTxModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  newItem: any = {
    name: '',
    category: 'FERTILIZER',
    unit: 'BAG',
    current_stock: 10,
    reorder_level: 5,
    unit_price: 1200,
    supplier: '',
  };

  txPayload: any = {
    item_id: '',
    transaction_type: 'OUTWARD',
    quantity: 1,
    notes: '',
  };

  inventoryColumns: TableColumn[] = [
    { key: 'name', label: 'Item Description' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'In Stock' },
    { key: 'unitCost', label: 'Unit Rate' },
    { key: 'totalVal', label: 'Stock Value' },
    { key: 'status', label: 'Reorder Status', badgeType: true }
  ];

  ngOnInit(): void {
    this.farmService.getFarms().subscribe({
      next: (farms) => {
        if (farms.length > 0) {
          this.farmId.set(farms[0].id);
          this.loadInventory();
        }
      },
      error: () => this.loadInventory()
    });
  }

  loadInventory(): void {
    const params = this.farmId() ? { farm_id: this.farmId() } : undefined;
    this.inventoryService.getItems(params).subscribe({
      next: (items) => {
        this.items.set(items);
        if (items.length > 0 && !this.txPayload.item_id) {
          this.txPayload.item_id = items[0].id;
        }
      },
      error: (err) => this.toast.error('Inventory Error', err.message || 'Failed to load inventory items')
    });

    this.inventoryService.getLowStockAlerts(this.farmId() || undefined).subscribe({
      next: (alerts) => this.lowStockAlerts.set(alerts),
      error: () => {}
    });
  }

  totalStockValue(): number {
    return this.items().reduce((acc, it) => acc + (Number(it.current_stock) * Number(it.unit_price)), 0);
  }

  setCategory(cat: string): void {
    this.currentCategory.set(cat);
  }

  tableRows(): any[] {
    const cat = this.currentCategory();
    const filtered = cat === 'ALL' ? this.items() : this.items().filter(it => it.category === cat);
    return filtered.map(it => ({
      id: it.id,
      name: it.name,
      category: it.category,
      quantity: `${it.current_stock} ${it.unit}`,
      unitCost: `₹${it.unit_price} / ${it.unit}`,
      totalVal: `₹${(Number(it.current_stock) * Number(it.unit_price)).toLocaleString('en-IN')}`,
      status: it.is_low_stock ? 'Low Stock' : 'Optimal',
    }));
  }

  openAddModal(): void {
    this.newItem = {
      name: '',
      category: 'FERTILIZER',
      unit: 'BAG',
      current_stock: 10,
      reorder_level: 5,
      unit_price: 1200,
      supplier: '',
    };
    this.showAddModal.set(true);
  }

  openTxModal(): void {
    if (this.items().length > 0) {
      this.txPayload.item_id = this.items()[0].id;
    }
    this.showTxModal.set(true);
  }

  submitNewItem(): void {
    if (!this.newItem.name) {
      this.toast.error('Validation', 'Please provide item description');
      return;
    }
    if (!this.farmId()) {
      this.toast.error('Error', 'No active farm holding found');
      return;
    }
    this.isSubmitting.set(true);
    const payload = { ...this.newItem, farm_id: this.farmId() };
    this.inventoryService.createItem(payload).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        this.showAddModal.set(false);
        this.toast.success('Inventory Added', `${created.name} registered into farm shed reserve.`);
        this.loadInventory();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error('Submission Failed', err.message || 'Could not register item');
      }
    });
  }

  submitTransaction(): void {
    if (!this.txPayload.item_id || !this.txPayload.quantity) {
      this.toast.error('Validation', 'Please select item and specify quantity');
      return;
    }
    this.isSubmitting.set(true);
    this.inventoryService.recordTransaction(this.txPayload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showTxModal.set(false);
        this.toast.success('Stock Updated', `Recorded ${this.txPayload.transaction_type} of ${this.txPayload.quantity} units.`);
        this.loadInventory();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error('Stock Rejected', err.error?.detail || err.message || 'Transaction rejected (e.g. negative stock check)');
      }
    });
  }

  onStockAction(row: any): void {
    if (confirm(`Remove inventory item "${row.name}" from database?`)) {
      this.inventoryService.deleteItem(row.id).subscribe({
        next: () => {
          this.toast.success('Item Deleted', `Removed ${row.name}`);
          this.loadInventory();
        },
        error: (err) => this.toast.error('Deletion Failed', err.message)
      });
    }
  }

  formatVal(val: number): string {
    return Math.round(val).toLocaleString('en-IN');
  }
}
