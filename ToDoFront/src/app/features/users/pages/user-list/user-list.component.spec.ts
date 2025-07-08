import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UsersService } from '../../services/users.service';
import { ErrorHandlerService } from '../../../../core/services/error/error-handler.service';
import { of, throwError } from 'rxjs';
import { Page } from '../../../../core/models/page.model';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserDto } from '../../models/user.model';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UsersService>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;

  const mockPage: Page<UserDto> = {
    content: [
      { id: 1, username: 'admin', role: 'ADMIN' },
      { id: 2, username: 'user', role: 'USER' },
    ],
    totalElements: 2,
    totalPages: 1,
    number: 0,
    size: 10,
    first: true,
    last: true,
  };

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UsersService', [
      'getUsers',
      'deleteUserById',
    ]);
    errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['handle']);

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UsersService, useValue: userServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should load users', fakeAsync(() => {
    userServiceSpy.getUsers.and.returnValue(of(mockPage));
    fixture.detectChanges(); // déclenche ngOnInit()
    tick();

    expect(userServiceSpy.getUsers).toHaveBeenCalledWith(0, 10);
    expect(component.users.length).toBe(2);
    expect(component.totalElements).toBe(2);
  }));

  it("should load users when new page", () => {
    userServiceSpy.getUsers.and.returnValue(of(mockPage));
    component.onPageChange({ pageIndex: 1, pageSize: 5, length: 2 } as any);

    expect(userServiceSpy.getUsers).toHaveBeenCalledWith(1, 5);
  });

  it('should delete user when confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userServiceSpy.deleteUserById.and.returnValue(of({}));
    userServiceSpy.getUsers.and.returnValue(of(mockPage));

    component.confirmDelete(1);

    expect(userServiceSpy.deleteUserById).toHaveBeenCalledWith(1);
    expect(userServiceSpy.getUsers).toHaveBeenCalled();
  });

  it("should dont delete user when cancel confirmation", () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.confirmDelete(1);

    expect(userServiceSpy.deleteUserById).not.toHaveBeenCalled();
  });

  it('should call errorHandler on error', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userServiceSpy.deleteUserById.and.returnValue(
      throwError(() => new Error('Erreur')),
    );

    component.confirmDelete(1);

    expect(errorHandlerSpy.handle).toHaveBeenCalledWith(
      'Erreur lors de la suppression',
      jasmine.any(Error),
    );
  });
});
