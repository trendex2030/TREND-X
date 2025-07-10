
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

async function fetchGif(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        return Buffer.from(response.data);
    } catch (error) {
        console.error('Error fetching GIF:', error.message);
        throw new Error('Failed to fetch GIF from URL');
    }
}

async function gifToVideo(gifBuffer) {
    try {
        // Créer des fichiers temporaires
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const inputPath = path.join(tempDir, `input_${Date.now()}.gif`);
        const outputPath = path.join(tempDir, `output_${Date.now()}.mp4`);
        
        // Écrire le GIF sur le disque
        fs.writeFileSync(inputPath, gifBuffer);
        
        // Convertir GIF en MP4 avec ffmpeg
        const command = `ffmpeg -i "${inputPath}" -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${outputPath}"`;
        
        await execPromise(command);
        
        // Lire le fichier de sortie
        const videoBuffer = fs.readFileSync(outputPath);
        
        // Nettoyer les fichiers temporaires
        try {
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        } catch (cleanupError) {
            console.warn('Warning: Could not cleanup temp files:', cleanupError.message);
        }
        
        return videoBuffer;
        
    } catch (error) {
        console.error('Error converting GIF to video:', error.message);
        // Si la conversion échoue, retourner le GIF original
        return gifBuffer;
    }
}

module.exports = {
    fetchGif,
    gifToVideo
};
