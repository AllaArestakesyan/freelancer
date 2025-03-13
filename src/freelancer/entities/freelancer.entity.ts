import { JobUser } from "src/job-user/entities/job-user.entity";
import { Job } from "src/jobs/entities/job.entity";
import { UserSkill } from "src/user-skills/entities/user-skill.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Freelancer{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId:number

    @ManyToOne(type => User, user =>user.freelancer, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    user: User

    @Column()
    salary: number

    @Column()
    profession: string

    @OneToMany(type => UserSkill, usSkill => usSkill.freelancer)
    skills: UserSkill[]

    @OneToMany(type => JobUser, jobuser => jobuser.freelancer)
    applay: JobUser[]

    
    @OneToMany(type => Job, job => job.freelancer)
    jobs: Job[]
}
