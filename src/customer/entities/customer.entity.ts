import { Job } from "src/jobs/entities/job.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId:number

    @Column()
    description:string

    @ManyToOne(type => User, user =>user.customer, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    user: User

    @OneToMany(type => Job, job => job.customer)
    jobs: Job[]  
}
