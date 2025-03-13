import { Freelancer } from 'src/freelancer/entities/freelancer.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class JobUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    freelancerId: number

    @Column("int")
    jobId: number

    @ManyToOne(type => Freelancer, freelancer => freelancer.applay, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    freelancer: Freelancer

    @ManyToOne(type => Job, job => job.jobUsers, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    job: Job


}