// Archetype definitions
const archetypes = {
    male: {
        warrior: { description: "The Warrior: Courageous, disciplined, and action-oriented, you face challenges head-on.", color: "#DC143C", image: "https://via.placeholder.com/200?text=Warrior" },
        sage: { description: "The Sage: Wise, introspective, and knowledge-seeking, you value insight above all.", color: "#1E3F66", image: "https://via.placeholder.com/200?text=Sage" },
        king: { description: "The King: Authoritative, responsible, and leadership-driven, you guide with confidence.", color: "#FFD700", image: "https://via.placeholder.com/200?text=King" },
        lover: { description: "The Lover: Passionate, creative, and emotionally expressive, you connect deeply.", color: "#800080", image: "https://via.placeholder.com/200?text=Lover" },
        explorer: { description: "The Explorer: Adventurous, curious, and freedom-seeking, you thrive on discovery.", color: "#228B22", image: "https://via.placeholder.com/200?text=Explorer" },
        creator: { description: "The Creator: Innovative, artistic, and visionary, you build new worlds.", color: "#FFA500", image: "https://via.placeholder.com/200?text=Creator" }
    },
    female: {
        queen: { description: "The Queen: Confident, nurturing, and influential, you lead with grace.", color: "#6A0DAD", image: "https://via.placeholder.com/200?text=Queen" },
        healer: { description: "The Healer: Empathetic, caring, and supportive, you help others grow.", color: "#20B2AA", image: "https://via.placeholder.com/200?text=Healer" },
        visionary: { description: "The Visionary: Intuitive and imaginative, you see the future clearly.", color: "#87CEEB", image: "https://via.placeholder.com/200?text=Visionary" },
        huntress: { description: "The Huntress: Independent, determined, and goal-oriented, you pursue your ambitions.", color: "#50C878", image: "https://via.placeholder.com/200?text=Huntress" },
        mystic: { description: "The Mystic: Spiritual and introspective, you connect with the unseen.", color: "#C0C0C0", image: "https://via.placeholder.com/200?text=Mystic" },
        maiden: { description: "The Maiden: Youthful, playful, and open-hearted, you bring joy to others.", color: "#FF69B4", image: "https://via.placeholder.com/200?text=Maiden" }
    },
    other: {
        trailblazer: { description: "The Trailblazer: Bold, pioneering, and innovative, you forge new paths.", color: "#FF4500", image: "https://via.placeholder.com/200?text=Trailblazer" },
        sage: { description: "The Sage: Wise, introspective, and knowledge-seeking, you value insight.", color: "#1E3F66", image: "https://via.placeholder.com/200?text=Sage" },
        guardian: { description: "The Guardian: Protective, loyal, and community-focused, you nurture others.", color: "#8B4513", image: "https://via.placeholder.com/200?text=Guardian" },
        visionary: { description: "The Visionary: Intuitive and imaginative, you see the future clearly.", color: "#87CEEB", image: "https://via.placeholder.com/200?text=Visionary" },
        creator: { description: "The Creator: Innovative, artistic, and visionary, you build new worlds.", color: "#FFA500", image: "https://via.placeholder.com/200?text=Creator" },
        seeker: { description: "The Seeker: Curious, reflective, and truth-seeking, you uncover hidden truths.", color: "#4B0082", image: "https://via.placeholder.com/200?text=Seeker" }
    }
};

// Handle user details form
document.getElementById('user-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('user-details').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
});

// Update progress bar
function updateProgress() {
    const totalQuestions = 10;
    const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
    const progress = (answeredQuestions / totalQuestions) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener('change', updateProgress);
});

// Handle quiz submission
document.getElementById('quiz-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const gender = document.getElementById('gender').value;
    const formData = new FormData(e.target);

    // Calculate scores
    const scores = {
        warrior: 0, sage: 0, king: 0, lover: 0, explorer: 0, creator: 0,
        queen: 0, healer: 0, visionary: 0, huntress: 0, mystic: 0, maiden: 0,
        trailblazer: 0, guardian: 0, seeker: 0
    };
    formData.forEach((value) => {
        scores[value]++;
    });

    // Determine dominant archetype
    let dominantArchetype = '';
    let maxScore = 0;
    const validArchetypes = gender === 'male' ? ['warrior', 'sage', 'king', 'lover', 'explorer', 'creator'] :
                           gender === 'female' ? ['queen', 'healer', 'visionary', 'huntress', 'mystic', 'maiden'] :
                           ['trailblazer', 'sage', 'guardian', 'visionary', 'creator', 'seeker'];
    validArchetypes.forEach((archetype) => {
        if (scores[archetype] > maxScore) {
            maxScore = scores[archetype];
            dominantArchetype = archetype;
        }
    });

    // Display result
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const resultImage = document.getElementById('result-image');
    const emailStatus = document.getElementById('email-status');
    const archetype = archetypes[gender][dominantArchetype] || { description: "No clear archetype.", color: "#fff", image: "" };
    
    resultText.innerText = archetype.description;
    resultContainer.style.background = archetype.color;
    resultContainer.style.color = archetype.color === '#FFD700' || archetype.color === '#87CEEB' || archetype.color === '#C0C0C0' ? '#333' : '#fff';
    resultImage.src = archetype.image;
    resultImage.style.display = 'block';
    emailStatus.innerText = 'Sending your result...';

    // Send data to backend
    try {
        const response = await fetch('https://archetype-generator-backend.onrender.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                gender,
                archetype: dominantArchetype,
                description: archetype.description,
                score: maxScore
            })
        });
        const result = await response.json();
        emailStatus.innerText = result.message || 'Result sent to your email!';
    } catch (error) {
        emailStatus.innerText = 'Failed to send email. Please try again.';
    }
});

// Restart quiz
function restartQuiz() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('user-details').style.display = 'block';
    document.getElementById('quiz-form').reset();
    document.getElementById('user-form').reset();
    document.getElementById('progress').style.width = '0%';
}

// Share result
function shareResult() {
    const resultText = document.getElementById('result-text').innerText;
    const shareUrl = `https://x.com/share?text=${encodeURIComponent(resultText + " Discover your archetype!")}`;
    window.open(shareUrl, '_blank');
}