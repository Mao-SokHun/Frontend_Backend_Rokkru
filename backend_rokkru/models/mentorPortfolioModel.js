import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

const MentorPortfolio = sequelize.define('MentorPortfolio', {
  mentor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING(250),
    primaryKey: true,
    allowNull: false
  },
  link_tag: {
    type: DataTypes.STRING(250)
  },
  description: {
    type: DataTypes.STRING(5000)
  },
  portfolio_date: {
    type: DataTypes.DATEONLY
  },
  technologies: {
    type: DataTypes.TEXT
  },
  item_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'link'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  attachments: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'mentor_portfolio',
  timestamps: false
});

export default MentorPortfolio;
