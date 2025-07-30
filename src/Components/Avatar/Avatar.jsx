import { useEffect, useState, useMemo } from 'react'
import { ClipLoader } from 'react-spinners';
import avatarStyles from '../AvatarStyles/AvatarStyles';
import './Avatar.css'
const Avatar = () => {
    const [avatarStyle, setAvatarStyle] = useState('bottts');
    const [seedInput, setSeedInput] = useState('bottts');
    const [seed, setSeed] = useState('bottts');
    const [styles, setStyles] = useState([]);
    const [imgError, setImgError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [inputError, setInputError] = useState('');

    const fallbackImage = 'https://via.placeholder.com/150?text=Avatar+Error';

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!seedInput.trim()) {
                setInputError('Seed cannot be empty.');
            } else if (seedInput.length > 30) {
                setInputError('Seed too long (max 30 chars).');
            } else {
                setSeed(seedInput.trim() || 'bottts');
                setInputError('');
            }      
        }, 500);

        return () => clearTimeout(timer);
    }, [seedInput]);

    const handleGenerate = () => {
        setLoading(true);        
        setTimeout(() => {
            const newSeed = Math.random().toString(36).substring(7);
            setSeed(newSeed);
            setLoading(false);
        }, 1000);
    };

    const handleEmojiGenerate = () => {
        setLoading(true);        
        setTimeout(() => {
            const emojis = ['🚀', '🐱‍👤', '🌈', '🧠', '⚡', '🔥', '🎨', '🎯'];
            const emojiSeed = emojis[Math.floor(Math.random() * emojis.length)];
            setSeed(emojiSeed);
            setLoading(false);
        }, 1000);
    }

    const avatarUrl = useMemo(() => {
        return `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${seed}`;
    }, [avatarStyle, seed]);

    const handleDownload = async () => {
        try {
            const response = await fetch(avatarUrl);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${avatarStyle}-${seed}.svg`;
            link.click();
        } catch (err) {
            console.error('Failed to download avatar:', err);
        }
    };

    const handleDownloadPng = async () => {
        try {
            const response = await fetch(avatarUrl);
            const svgText = await response.text();

            const img = new Image();
            const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 256;
                canvas.height = 256;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(img, 0, 0);

                const pngUrl = canvas.toDataURL('image/png');

                const link = document.createElement('a');
                link.href = pngUrl;
                link.download = `${avatarStyle}-${seed}.png`;
                link.click();

                URL.revokeObjectURL(url);
            };

            img.onerror = () => {
                console.error('Failed to convert SVG to PNG');
            };

            img.src = url;
        } catch (error) {
            console.error('Failed to download PNG:', error);
        }
    };

    useEffect(() => {
        setStyles(avatarStyles)       
    }, []);

    useEffect(() => {
        handleGenerate();
    }, [avatarStyle]);

    
  return (
    <div className='avatar__container'>
        
        <div className='avatar__home'>
            <div className='avatar__left'>

                <div className='avatar__buttons'>
                    {
                        Array.isArray(styles) && styles.length > 0 ? (
                            styles.map(({ style, label }) => (
                                <button 
                                    key={style} 
                                    onClick={() => setAvatarStyle(style)} 
                                    className={`avatar__button ${style === avatarStyle ? 'active' : ''}`}
                                >
                                    {label}
                                </button>
                            ))
                        ) : (
                            <ClipLoader color="#007bff" size={50} />
                        )
                    }
                </div>
            </div>
            <div className='avatar__right'>
                <div className='avatar__image'>
                    {loading ? (
                        <ClipLoader color="#007bff" size={50} />
                        ) : (
                        <img                        
                            src={imgError ? fallbackImage : avatarUrl}
                            alt={avatarStyle}
                            onError={() => setImgError(true)}
                            onLoad={() => setImgError(false)}
                            className={fadeIn ? 'fade-in' : ''}
                            onAnimationEnd={() => setFadeIn(true)}
                        />
                    )}
                </div>

                <div className='avatar__generate'>
                    
                    <input
                        type="text"
                        value={seedInput}
                        onChange={(e) => setSeedInput(e.target.value)}
                        placeholder="Enter custom seed (e.g., emoji 🚀)"
                        className="avatar__input"
                        aria-label='Custom avatar seed'
                        aria-describedby='seed-desc'
                        id='avatar-seed-input'
                    />
                    <small id='seed-desc' style={{ fontSize: '0.8rem', color: '#666' }}>
                        Seed controls the uniqueness of the avatar. Emojis work too!
                    </small>
                    {inputError && <p className="error-message">{inputError}</p>}
                    <button 
                        onClick={handleEmojiGenerate} 
                        className="avatar__button" 
                        disabled={loading} 
                        aria-label='Generate avatar with random emoji seed'
                    >🎲 Emoji Seed</button>
                    <button 
                        onClick={handleGenerate} 
                        className="avatar__button" 
                        disabled={loading} 
                        aria-label='Generate new random avatar'
                    >New Image</button>
                    <button 
                        onClick={handleDownload} 
                        className="avatar__button"
                        aria-label='Download avatar as SVG'
                    >Download SVG</button>
                    <button 
                        onClick={handleDownloadPng} 
                        className="avatar__button"
                        aria-label='Download avatar as PNG'
                    >Download PNG</button>
                </div>
            </div>
            
        </div>
      
    </div>
  )
}

export default Avatar
