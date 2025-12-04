interface BadgeProps {
  type: 'live' | 'replay';
  children: React.ReactNode;
}

export function Badge({ type, children }: BadgeProps) {
  const styles = {
    live: 'bg-[#7bc67e] text-white',
    replay: 'bg-[#c9b8e4] text-white'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${styles[type]}`}>
      {children}
    </span>
  );
}
