import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Keep using compat
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface MenuItem {
  id?: string;
  title: string;
  path: string;
  icon?: string;
  order?: number;
  isVisible?: boolean;
  children?: MenuItem[];
}

interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
  createdAt: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-menu-editor',
  templateUrl: './menu-editor.component.html',
  styleUrls: ['./menu-editor.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    AngularFirestore,
  ],
  standalone: true
})
export class MenuEditorComponent implements OnInit {
  menus: Menu[] = [];
  selectedMenu: Menu | null = null;
  menuForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  showDeleteConfirmation = false;

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder
  ) {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      items: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus() {
    this.firestore.collection<Menu>('menus', ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges({ idField: 'id' })
      .subscribe(menus => {
        this.menus = menus;
      });
  }

  initForm(menu?: Menu) {
    this.menuForm = this.fb.group({
      name: [menu?.name || '', [Validators.required, Validators.minLength(3)]],
      items: this.fb.array([])
    });

    const items = this.menuForm.get('items') as FormArray;
    items.clear();

    if (menu?.items) {
      menu.items.forEach(item => {
        items.push(this.createMenuItem(item));
      });
    }
  }

  createMenuItem(item: any = {}): FormGroup {
    return this.fb.group({
      title: [item.title || '', Validators.required],
      path: [item.path || '', Validators.required],
      icon: [item.icon || ''],
      order: [item.order || 0],
      isVisible: [item.isVisible !== false],
      children: this.fb.array(
        (item.children || []).map(child => this.createMenuItem(child))
      )
    });
  }

  get items(): FormArray {
    return this.menuForm.get('items') as FormArray;
  }

  getChildren(itemIndex: number): FormArray {
    return this.items.at(itemIndex).get('children') as FormArray;
  }

  addMenuItem(item?: any) {
    this.items.push(this.createMenuItem(item));
  }

  removeMenuItem(index: number) {
    this.items.removeAt(index);
  }

  addChildItem(itemIndex: number) {
    this.getChildren(itemIndex).push(this.createMenuItem());
  }

  removeChildItem(itemIndex: number, childIndex: number) {
    this.getChildren(itemIndex).removeAt(childIndex);
  }

  startNewMenu() {
    this.selectedMenu = null;
    this.isEditing = true;
    this.initForm();
  }

  editMenu(menu: Menu) {
    this.selectedMenu = menu;
    this.isEditing = true;
    this.initForm(menu);
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedMenu = null;
  }

  confirmDelete(menuId: string) {
    this.deleteMenu(menuId)
  }

  deleteMenu(menuId: string) {
    this.firestore.collection('menus').doc(menuId).delete();
  }

  saveMenu() {
    if (this.menuForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const menuData = {
      name: this.menuForm.value.name,
      items: this.menuForm.value.items,
      updatedAt: new Date(),
      createdAt: this.selectedMenu?.createdAt || new Date()
    };

    const savePromise = this.selectedMenu?.id
      ? this.firestore.collection('menus').doc(this.selectedMenu.id).update(menuData)
      : this.firestore.collection('menus').add(menuData);

    savePromise
      .then(() => {
        this.isEditing = false;
        this.selectedMenu = null;
      })
      .catch(error => console.error('Error saving menu:', error))
      .finally(() => this.isSubmitting = false);
  }
}