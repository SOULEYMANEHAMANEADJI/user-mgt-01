import { Component, computed, OnInit, signal } from '@angular/core';
import { User } from '../../models/user';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe, NgForOf, NgIf, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, TitleCasePipe, CurrencyPipe, NgxPaginationModule, NgForOf, UpperCasePipe],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  // Déclaration des propriétés et signaux
  userList = signal<User[]>([]);
  userFiltered = signal<User[]>([]);
  searchInput = "";
  editMode: boolean = false;
  p: number = 1;  // Page courante
  itemsPerPage: number = 4; // Nombre d'éléments par page
  userNameDuplicate: boolean = false;  // Nouveau drapeau pour vérifier les doublons
  genderFilter: string = ''; // Variable pour stocker le filtre de genre
  user: User = {
    identifier: "",
    name: "",
    department: "HR",
    salary: 0,
    gender: "male",
    status: false
  };

  departmentList: string[] = ['IT', 'HR', 'LOGISTICS', 'AI'];

  // Signal calculé pour obtenir le total des salaires des utilisateurs actifs uniquement
  totalSalary = computed(() => {
    return this.userList().filter(user => user.status).reduce((acc, user) => acc + user.salary, 0);
  });  // Signal calculé pour le nombre des users
  nbUsers = computed<number>(() => this.userList().length);

  constructor(private _userService: UserService, private _toaStr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.user.identifier = this.generateUniqueId();
  }

  loadUsers(): void {
    this._userService.getUsers().subscribe({
      next: (res) => {
        this.userList.set(res);
        this.filterUsers();
      },
      error: (err) => this._toaStr.error('Failed to load users', 'Error')
    });
  }
  filterUsers(): void {
    const search = this.searchInput.toLowerCase();

    // Filtrer les utilisateurs en fonction de la recherche et du genre sélectionné
    this.userFiltered.set(
      this.userList().filter(user => {
        const matchesSearch =
          user.name.toLowerCase().includes(search) ||
          user.department.toLowerCase().includes(search) ||
          user.salary.toString().includes(search) ||
          user.gender.toLowerCase().includes(search);

        // Appliquer le filtre de genre indépendant
        const matchesGender = this.genderFilter ? user.gender.toLowerCase() === this.genderFilter.toLowerCase() : true;

        return matchesSearch && matchesGender;
      })
    );
  }
  resetSearch(): void {
    this.searchInput = '';
    this.genderFilter = '';
    this.filterUsers(); // Applique les filtres mis à jour
  }
  onGenderChange(): void {
    this.filterUsers();
  }
  isSearchDefault(): boolean {
    return this.searchInput === '' && this.genderFilter === '';
  }
  isFormDefault(): boolean {
    return (this.user.name === '' &&
      this.user.department === 'HR' &&
      this.user.salary === 0 &&
      this.user.gender === 'male' && !this.user.status);
  }
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    // Réinitialiser l'indicateur de doublon avant chaque soumission
    this.userNameDuplicate = false;

    // Vérifier les doublons uniquement en mode ajout
    if (!this.editMode && this.isDuplicateUserName(this.user.name)) {
      this.userNameDuplicate = true;
      this._toaStr.error('User with this name already exists!', 'Duplicate Error');
      return;
    }

    if (this.editMode) {
      // Mode édition
      this._userService.updateUser(this.user).subscribe({
        next: () => {
          this.loadUsers();
          this.editMode = false;
          form.reset();
          this.user.identifier = this.generateUniqueId();
          this._toaStr.warning('User Updated Successfully!', 'Updated');
        },
        error: () => this._toaStr.error('Failed to update user', 'Error')
      });
    } else {
      // Mode ajout
      this._userService.addUser(this.user).subscribe({
        next: () => {
          this.loadUsers();
          form.reset();
          this.user.identifier = this.generateUniqueId();
          this._toaStr.success('User Added Successfully!', 'Success');
        },
        error: () => this._toaStr.error('Failed to add user', 'Error')
      });
    }
  }

  private isDuplicateUserName(name: string): boolean {
    const lowerCaseName = name.toLowerCase();
    return this.userList().some(user => user.name.toLowerCase() === lowerCaseName);
  }

  private generateUniqueId(): string {
    const timestampPart = Date.now().toString().slice(-4);
    const randomPart = Math.random().toString(36).substring(2, 7);
    return `${timestampPart}${randomPart}`;
  }

  onResetForm(form: NgForm): void {
    form.reset();
    this.user = {
      identifier: this.generateUniqueId(),
      name: '',
      department: 'HR',
      salary: 0,
      gender: 'male',
      status: false
    };
    this.editMode = false;
  }

  onEdit(userData: User): void {
    this.user = { ...userData };
    this.editMode = true;
  }

  onDelete(id: number | undefined): void {
    if (confirm("Are you sure you want to delete this user?")) {
      this._userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this._toaStr.error('User Deleted Successfully!', 'Deleted');
        },
        error: () => this._toaStr.error('Failed to delete user', 'Error')
      });
    }
  }

  onDeleteAll(): void {
    if (confirm('Are you sure you want to delete all users?')) {
      this._userService.deleteAllUsers().subscribe({
        next: () => {
          this.loadUsers();
          this._toaStr.error('All Users Deleted Successfully!', 'Deleted');
        },
        error: () => this._toaStr.error('Failed to delete all users', 'Error')
      });
    }
  }
}
