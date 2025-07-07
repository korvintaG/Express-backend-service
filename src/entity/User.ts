import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm"

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity()
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullName: string;

    @Column({ type: 'date' })
    birthDate: Date;

    @Column()
    email: string;

    @Column()
    password: string;

    // Используем type: 'text' вместо enum для совместимости с SQLite
    @Column({ type: 'text', default: UserRole.USER })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;
}
