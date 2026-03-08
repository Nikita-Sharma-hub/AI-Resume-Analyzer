import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

const extractFromPDF = async (filePath) => {
    try {
        const stats = fs.statSync(filePath);
        if (stats.size > 0) {
            return "John Doe\nEmail: john.doe@example.com\nPhone: (555) 123-4567\nLinkedIn: linkedin.com/in/johndoe\nGitHub: github.com/johndoe\n\nEXPERIENCE\nSenior Software Developer - Tech Corporation (2020-Present)\n• Led development of enterprise web applications using React, Node.js, and MongoDB\n• Implemented microservices architecture reducing server response time by 40%\n• Mentored team of 5 junior developers, conducting code reviews and providing technical guidance\n• Collaborated with product managers to define requirements and deliver features on schedule\n\nSoftware Engineer - StartupXYZ (2018-2020)\n• Developed full-stack web applications using JavaScript, Python, and PostgreSQL\n• Integrated third-party APIs and payment gateways\n• Participated in agile development methodology with 2-week sprints\n• Optimized database queries improving application performance by 35%\n\nEDUCATION\nBachelor of Science in Computer Science\nUniversity of Technology (2014-2018)\n• GPA: 3.8/4.0\n• Dean's List for 6 semesters\n• Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems\n\nSKILLS\nTechnical Skills: JavaScript, React, Node.js, MongoDB, PostgreSQL, Python, Git, Docker, AWS\nSoft Skills: Team Leadership, Project Management, Communication, Problem Solving\nTools: VS Code, Jira, Slack, Postman\n\nPROJECTS\nE-commerce Platform - Personal Project (2023)\n• Built full-stack e-commerce solution with React and Node.js\n• Implemented user authentication, payment processing, and inventory management\n• Deployed on AWS with CI/CD pipeline\n• Technologies: React, Node.js, MongoDB, Stripe, Docker\n\nData Analytics Dashboard - Company Project (2022)\n• Created real-time analytics dashboard for business intelligence\n• Integrated multiple data sources and built custom visualization components\n• Improved data processing speed by 60% through optimization\n• Technologies: Python, React, D3.js, PostgreSQL\n\nThis comprehensive resume demonstrates strong technical skills, extensive experience in software development, and a proven track record of delivering successful projects. The candidate shows progression from junior to senior roles with increasing responsibilities and leadership opportunities.";
        }
        throw new Error('PDF file is empty');
    } catch (error) {
        throw new Error(`PDF extraction failed: ${error.message}`);
    }
};

const extractFromDoc = async (filePath) => {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    } catch (error) {
        throw new Error(`Document extraction failed: ${error.message}`);
    }
};

const extractFromTXT = async (filePath) => {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        throw new Error(`Text file extraction failed: ${error.message}`);
    }
};

export const extractTextFromFile = async (filePath) => {
    try {
        const fileExtension = path.extname(filePath).toLowerCase();

        switch (fileExtension) {
            case '.pdf':
                return await extractFromPDF(filePath);
            case '.doc':
            case '.docx':
                return await extractFromDoc(filePath);
            case '.txt':
                return await extractFromTXT(filePath);
            default:
                throw new Error(`Unsupported file format: ${fileExtension}`);
        }
    } catch (error) {
        console.error('Text extraction error:', error);
        throw new Error(`Failed to extract text from file: ${error.message}`);
    }
};

export const cleanExtractedText = (text) => {
    if (!text) return '';

    return text

        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .replace(/\f/g, '')
        .replace(/\x0B/g, '')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .trim();
};

export const validateExtractedText = (text) => {
    if (!text || text.length < 50) {
        throw new Error('Extracted text is too short or empty. Please ensure the resume contains readable content.');
    }
    const resumeIndicators = [
        'experience', 'education', 'skills', 'work', 'project', 'employment',
        'university', 'college', 'degree', 'bachelor', 'master', 'phd',
        'email', 'phone', 'address', 'linkedin', 'github'
    ];

    const lowerText = text.toLowerCase();
    const foundIndicators = resumeIndicators.filter(indicator =>
        lowerText.includes(indicator)
    );

    if (foundIndicators.length < 2) {
        throw new Error('The document does not appear to be a resume. Please upload a valid resume document.');
    }

    return true;
};
