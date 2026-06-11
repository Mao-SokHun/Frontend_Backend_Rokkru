/**
 * One-time helper: fill NULL sub_skill_name / sub_skill_name_kh from a static map.
 * Run: node scripts/seedSubSkillNames.js
 */
import { Skill, SubSkill, sequelize } from '../models/index.js'

const NAMES_BY_SKILL_ID = {
  1: ['Java', 'JavaScript', 'Python', 'SQL', 'React JS'],
  2: ['Statistics', 'Python', 'SQL', 'Machine Learning', 'Data Structures'],
  3: ['Accounting', 'Finance', 'Economics', 'Statistics', 'Mathematics'],
  4: ['History', 'Geography', 'Mathematics', 'Physics', 'Biology'],
  5: ['Data Structures', 'Algorithms', 'C++', 'C', 'Java'],
}

const KH_BY_EN = {
  Java: 'Java',
  JavaScript: 'JavaScript',
  Python: 'Python',
  SQL: 'SQL',
  'React JS': 'React JS',
  Statistics: 'ស្ថិតិ',
  'Machine Learning': 'Machine Learning',
  'Data Structures': 'Data Structures',
  Algorithms: 'Algorithms',
  'C++': 'C++',
  C: 'C',
  Accounting: 'Accounting',
  Finance: 'Finance',
  Economics: 'Economics',
  Mathematics: 'គណិតវិទ្យា',
  History: 'History',
  Geography: 'Geography',
  Physics: 'រូបវិទ្យា',
  Biology: 'Biology',
}

async function main() {
  await sequelize.authenticate()

  const skills = await Skill.findAll({ order: [['skill_id', 'ASC']] })
  let updated = 0

  for (const skill of skills) {
    const names = NAMES_BY_SKILL_ID[skill.skill_id]
    if (!names?.length) continue

    const subs = await SubSkill.findAll({
      where: { skill_id: skill.skill_id },
      order: [['sub_skill_id', 'ASC']],
    })

    for (let i = 0; i < subs.length && i < names.length; i += 1) {
      const sub = subs[i]
      const en = names[i]
      const kh = KH_BY_EN[en] ?? en
      if (sub.sub_skill_name === en && sub.sub_skill_name_kh === kh) continue
      await sub.update({
        sub_skill_name: en,
        sub_skill_name_kh: kh,
        update_date: new Date(),
      })
      updated += 1
      console.log(`sub_skill_id ${sub.sub_skill_id}: ${en} / ${kh}`)
    }
  }

  console.log(`Done. Updated ${updated} row(s).`)
  await sequelize.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
