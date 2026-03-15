require('dotenv').config();

const pg = require('pg');

const url = process.env.DATABASE_URL;
console.log('DATABASE_URL:', url);

const client = new pg.Client(url);

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Clean existing data
    console.log('Cleaning existing data...');
    await client.query('DELETE FROM "Skill" CASCADE');
    await client.query('DELETE FROM "Experience" CASCADE');
    await client.query('DELETE FROM "Project" CASCADE');
    await client.query('DELETE FROM "Certificate" CASCADE');
    await client.query('DELETE FROM "AboutCard" CASCADE');

    // Seeds skills
console.log('Seeding skills...');
    const skills = [
      {
        category: 'Frontend',
        icon: 'mdi:palette-outline',
        items: 'React.js, Nuxt.js, Flutter, Tailwind, Bootstrap, JavaScript',
        order: 0,
      },
      {
        category: 'Backend',
        icon: 'mdi:server',
        items: 'NestJS, TypeScript, MySQL, PostgreSQL',
        order: 1,
      },
      {
        category: 'Design',
        icon: 'mdi:vector-square',
        items: 'Figma, Canva',
        order: 2,
      },
      {
        category: 'Tools',
        icon: 'mdi:wrench-outline',
        items: 'Git, Docker, Firebase',
        order: 3,
      },
      {
        category: 'ML',
        icon: 'mdi:brain',
        items: 'Python, TensorFlow, PyTorch, OpenCV',
        order: 4,
      },
      {
        category: 'Embedded',
        icon: 'mdi:chip',
        items: 'Arduino Uno, ESP32, Sensors, Actuators',
        order: 5,
      },
    ];

    for (const skill of skills) {
      await client.query(
        `INSERT INTO "Skill" (category, icon, items, "order") VALUES ($1, $2, $3, $4)`,
        [skill.category, skill.icon, skill.items, skill.order]
      );
    }
    console.log('✅ Skills seeded');

    // Seed projects
    console.log('Seeding projects...');
    const projects = [
      {
        title: 'Dental Caries Classification using FPN',
        description:
          'Deep learning research project utilizing Feature Pyramid Network architecture for dental caries segmentation and classification.',
        techStack: 'Python, TensorFlow, OpenCV, Deep Learning, FPN',
        icon: 'mdi:tooth-outline',
        githubUrl: '#',
        demoUrl: '#',
        order: 0,
      },
      {
        title: 'LeakGuard — IoT Irrigation Monitoring',
        description:
          'IoT-based irrigation leak detection system designed to improve water efficiency aligned with SDG 6.4.',
        techStack: 'Arduino, IoT, Sensors, Water Efficiency, SDG 6.4',
        icon: 'mdi:water-alert-outline',
        githubUrl: '#',
        demoUrl: '#',
        order: 1,
      },
      {
        title: 'WudhuCycle — Greywater Reuse System',
        description:
          'Smart greywater reuse system with integrated mobile application built in Flutter.',
        techStack: 'Flutter, Arduino, IoT, Mobile App, Sustainability',
        icon: 'mdi:recycle-variant',
        githubUrl: '#',
        demoUrl: '#',
        order: 2,
      },
      {
        title: 'Mobile App Projects',
        description:
          'Collection of Flutter-based mobile applications showcasing cross-platform development skills.',
        techStack: 'Flutter, Dart, REST API, Firebase, Mobile',
        icon: 'mdi:cellphone',
        githubUrl: '#',
        demoUrl: '#',
        order: 3,
      },
    ];

    for (const project of projects) {
      await client.query(
        `INSERT INTO "Project" (title, description, "techStack", icon, "githubUrl", "demoUrl", "order") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          project.title,
          project.description,
          project.techStack,
          project.icon,
          project.githubUrl,
          project.demoUrl,
          project.order,
        ]
      );
    }
    console.log('✅ Projects seeded');

    // Seed experiences
    console.log('Seeding experiences...');
    const experiences = [
      {
        role: 'Full Stack Developer',
        company: 'Bangkit Academy',
        position: 'Cloud Computing Track',
        period: 'Feb 2023 - Aug 2023 · Cohort 2023',
        location: 'Jakarta, Indonesia',
        logo: '#',
        description:
          'Intensive program focused on Google Cloud Platform, backend services, and mobile development.',
        order: 0,
      },
      {
        role: 'IoT Developer',
        company: 'Personal Projects',
        position: 'LeakGuard & WudhuCycle Project Lead',
        period: 'Jan 2023 - Present',
        location: 'Jakarta, Indonesia',
        logo: '#',
        description:
          'Designing and developing IoT solutions for water efficiency and sustainability (SDG alignment).',
        order: 1,
      },
      {
        role: 'Machine Learning Engineer',
        company: 'Research',
        position: 'Dental Caries Classification Research',
        period: 'Jun 2022 - Dec 2022',
        location: 'Jakarta, Indonesia',
        logo: '#',
        description:
          'Researching and implementing Deep Learning models for medical image segmentation.',
        order: 2,
      },
    ];

    for (const experience of experiences) {
      await client.query(
        `INSERT INTO "Experience" (role, company, position, period, location, logo, description, "order") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          experience.role,
          experience.company,
          experience.position,
          experience.period,
          experience.location,
          experience.logo,
          experience.description,
          experience.order,
        ]
      );
    }
    console.log('✅ Experiences seeded');

    // Seed certificates
    console.log('Seeding certificates...');
    const certificates = [
      {
        title: 'Google Cloud Associate Cloud Engineer',
        description:
          'Certification validating expertise in designing and deploying scalable systems on Google Cloud.',
        credentialUrl: '#',
        order: 0,
      },
      {
        title: 'Belajar Dasar Pemrograman Web',
        description:
          'Foundational web development course covering HTML, CSS, and modern JavaScript.',
        credentialUrl: '#',
        order: 1,
      },
      {
        title: 'Belajar Membuat Aplikasi Back-End untuk Pemula',
        description:
          'Back-end development fundamentals using Node.js and REST APIs on Dicoding Indonesia.',
        credentialUrl: '#',
        order: 2,
      },
      {
        title: 'Belajar Dasar Pemrograman JavaScript',
        description:
          'Core JavaScript programming including ES6+ features, async programming, and DOM manipulation.',
        credentialUrl: '#',
        order: 3,
      },
      {
        title: 'Cloud Computing Learning Path (Bangkit Academy)',
        description:
          'Intensive program focused on Google Cloud Platform backend services and cloud architectures.',
        credentialUrl: '#',
        order: 4,
      },
      {
        title: 'Front-End Web Developer Learning Path (Bangkit Academy)',
        description:
          'Web development specialization covering React/Vue, mobile-responsive design, and advanced JavaScript.',
        credentialUrl: '#',
        order: 5,
      },
    ];

    for (const cert of certificates) {
      await client.query(
        `INSERT INTO "Certificate" (title, description, "credentialUrl", "order") VALUES ($1, $2, $3, $4)`,
        [cert.title, cert.description, cert.credentialUrl, cert.order]
      );
    }
    console.log('✅ Certificates seeded');

    // Seed about cards
    console.log('Seeding about cards...');
    const aboutCards = [
      {
        title: 'Who Am I',
        content: `I'm a passionate software engineer with expertise in full-stack development, IoT systems, and machine learning. My journey in tech started with a curiosity about how things work, evolving into a career focused on building scalable, impactful digital solutions.

I specialize in mobile app development using Flutter, backend services with NestJS, and cloud infrastructure on Google Cloud Platform. My passion drives me to create technology that solves real-world problems and aligns with sustainable development.`,
        icon: 'mdi:card-account-details-outline',
        textColor: 'text-gray-600 dark:text-gray-400',
        order: 0,
      },
      {
        title: 'What I Do',
        content: `I design and develop end-to-end solutions spanning multiple domains:

• Mobile Development: Cross-platform apps using Flutter with clean architecture.
• Backend Services: RESTful APIs and microservices with NestJS and TypeScript.
• Cloud Infrastructure: Deployment and scaling on Google Cloud Platform.
• IoT Solutions: Smart systems with Arduino, sensors, and real-time monitoring.
• Machine Learning: Deep learning for computer vision and medical imaging.
• UI/UX: Responsive, accessible interfaces with Tailwind CSS and modern frameworks.`,
        icon: 'mdi:code-braces-box',
        textColor: 'text-gray-600 dark:text-gray-400',
        order: 1,
      },
      {
        title: 'Why It Matters',
        content: `I believe technology should serve humanity. My projects are driven by a commitment to sustainable development and meaningful impact.

Whether building water efficiency systems aligned with SDG 6.4, developing medical diagnostic tools, or creating responsive applications that work across devices—each project reflects my dedication to quality, sustainability, and user-centric design.

I'm always learning, always growing, and always looking for the next challenge that combines technical excellence with real-world purpose.`,
        icon: 'mdi:lightbulb-outline',
        textColor: 'text-gray-600 dark:text-gray-400',
        order: 2,
      },
    ];

    for (const card of aboutCards) {
      await client.query(
        `INSERT INTO "AboutCard" (title, content, icon, "textColor", "order") VALUES ($1, $2, $3, $4, $5)`,
        [card.title, card.content, card.icon, card.textColor, card.order]
      );
    }
    console.log('✅ About cards seeded');

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
