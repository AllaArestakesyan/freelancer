import { Role } from 'src/user/role/role.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Freelancer } from 'src/freelancer/entities/freelancer.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    emailToken: string;

    @Column({ default: 0 })
    isVerified: number;
    @Column({ default: 0 })
    code: number;

    @Column()
    role: Role

    @OneToMany(type => Customer, customer => customer.user)
    customer: Customer
 
    @OneToMany(type => Freelancer, freelancer => freelancer.user)
    freelancer: Freelancer
    
    
}