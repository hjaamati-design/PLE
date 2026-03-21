import Image from "next/image";

export default function Header() {
    return (
        <header className="header" style={{ justifyContent: 'flex-start' }}>
            <div className="logo-container" style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '8px 16px',
            }}>
                <Image
                    src="/logo.png"
                    alt="PLE Events"
                    width={180}
                    height={75}
                    priority
                    style={{ objectFit: 'contain' }}
                />
            </div>
        </header>
    );
}
