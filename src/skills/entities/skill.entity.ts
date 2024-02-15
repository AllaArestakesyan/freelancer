import { JobSkill } from 'src/job-skill/entities/job-skill.entity';
import { UserSkill } from 'src/user-skills/entities/user-skill.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @OneToMany(type => UserSkill, usSkill => usSkill.skill)
    freelancer: UserSkill[]

    @OneToMany(type => JobSkill, usSkill => usSkill.skill)
    jobs: JobSkill[]
}