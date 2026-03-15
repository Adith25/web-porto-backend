require('dotenv').config();

const pg = require('pg');

const url = process.env.DATABASE_URL;
console.log('Restoring original experiences...');

const client = new pg.Client(url);

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Clean existing experiences
    console.log('Cleaning existing experiences...');
    await client.query('DELETE FROM "Experience" CASCADE');

    // Restore original experiences
    console.log('Restoring original experiences...');
    const experiences = [
      {
        role: "Intern Information Technology Department",
        company: "AirNav Indonesia · Internship",
        period: "Oct 2025 - Present · 6 mos",
        location: "Tangerang, Banten, Indonesia · On-site",
        logo: "/images/logo_airnav.png",
        description: "Flutter, Mobile Application Development, Engineering, Software Infrastructure, Information Technology Infrastructure",
        order: 0,
      },
      {
        role: "Signal Processing Teaching Assistant",
        company: "Universitas Syiah Kuala · Part-time",
        period: "Mar 2025 - Jun 2025 · 4 mos",
        location: "Banda Aceh, Aceh, Indonesia · On-site",
        logo: "/images/logo_usk.svg.png",
        description: "MATLAB",
        order: 1,
      },
      {
        role: "Multimedia Signal Processing Teaching Assistant",
        company: "Universitas Syiah Kuala",
        period: "Jul 2024 - Dec 2024 · 6 mos",
        location: "Banda Aceh, Aceh, Indonesia · On-site",
        logo: "/images/logo_usk.svg.png",
        description: "MATLAB, Encoding, Decoding, Signal Processing, Image Processing",
        order: 2,
      },
      {
        role: "Software Engineering Lab Assistant",
        company: "Universitas Syiah Kuala",
        period: "Feb 2024 - Jun 2024 · 5 mos",
        location: "Banda Aceh, Aceh, Indonesia · On-site",
        logo: "/images/logo_usk.svg.png",
        description: "Scrum, Unified Modeling Language (UML)",
        order: 3,
      },
      {
        role: "Head of Public Relations Division",
        company: "Himpunan Mahasiswa Teknik Komputer USK",
        period: "Jan 2024 - Dec 2024 · 1 yr",
        location: "Banda Aceh, Aceh, Indonesia · On-site",
        logo: "/images/logo_himatekkom.png",
        description: "Public Speaking, Leadership, Teamwork",
        order: 4,
      },
      {
        role: "Member of Public Relations Division",
        company: "Himpunan Mahasiswa Teknik Komputer USK",
        period: "Jan 2023 - Dec 2023 · 1 yr",
        location: "Banda Aceh, Aceh, Indonesia · On-site",
        logo: "/images/logo_himatekkom.png",
        description: "Teamwork",
        order: 5,
      },
      {
        role: "Member of Talent and Interests Division",
        company: "Himpunan Mahasiswa Teknik Komputer USK",
        period: "Jan 2022 - Dec 2022 · 1 yr",
        location: "Banda Aceh, Aceh, Indonesia · On-site",
        logo: "/images/logo_himatekkom.png",
        description: "",
        order: 6,
      },
      {
        role: "Bangkit Academy 2023 - Machine Learning Path",
        company: "Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka · Seasonal",
        period: "Aug 2023 - Jan 2024 · 6 mos",
        location: "Banda Aceh, Aceh, Indonesia · Remote",
        logo: "/images/bangkit_logo.jpg",
        description: "Machine Learning, Deep Learning",
        order: 7,
      },
    ];

    for (const exp of experiences) {
      await client.query(
        `INSERT INTO "Experience" (role, company, period, location, logo, description, "order") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          exp.role,
          exp.company,
          exp.period,
          exp.location,
          exp.logo,
          exp.description,
          exp.order,
        ]
      );
    }
    console.log('✅ Experiences restored successfully!');

  } catch (error) {
    console.error('❌ Error restoring experiences:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
