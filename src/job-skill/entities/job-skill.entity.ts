import { Job } from 'src/jobs/entities/job.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';



@Entity()
export class JobSkill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    skillId: number

    @Column("int")
    jobId: number
    
    @ManyToOne(type => Job, job =>job.jobSkills, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    job: Job

    @ManyToOne(type => Skill, skill =>skill.jobs, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    skill: Skill
}