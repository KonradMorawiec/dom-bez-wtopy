import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, deleteDoc, updateDoc, addDoc } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';

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
  standalone: true
})
export class MenuEditorComponent implements OnInit {
  private firestore = inject(Firestore);

  menus: Menu[] = [];
  selectedMenu: Menu | null = null;
  menuForm: FormGroup;
  isEditing = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      items: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus() {
    const menusCollection = collection(this.firestore, 'menus');
    collectionData(menusCollection, { idField: 'id' }).subscribe((menus: any[]) => {
      this.menus = menus.map(menu => ({
        id: menu.id,
        name: menu.name,
        items: menu.items || [],
        createdAt: menu.createdAt?.toDate() || new Date(),
        updatedAt: menu.updatedAt?.toDate() || undefined
      }));
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
    this.deleteMenu(menuId);
  }

  async deleteMenu(menuId: string) {
    try {
      const menuDoc = doc(this.firestore, `menus/${menuId}`);
      await deleteDoc(menuDoc);
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  }

  async saveMenu() {
    if (this.menuForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const menuData = {
      name: this.menuForm.value.name,
      items: this.menuForm.value.items,
      updatedAt: Timestamp.now(),
      createdAt: this.selectedMenu?.createdAt || Timestamp.now()
    };

    try {
      if (this.selectedMenu?.id) {
        const menuDoc = doc(this.firestore, `menus/${this.selectedMenu.id}`);
        await updateDoc(menuDoc, menuData);
      } else {
        const menusCollection = collection(this.firestore, 'menus');
        await addDoc(menusCollection, menuData);
      }

      this.isEditing = false;
      this.selectedMenu = null;
    } catch (error) {
      console.error('Error saving menu:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}