function Spinner() {
  return (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

export default function SpinnerButton({
  id,
  className,
  type,
  label,
  labelPending,
  isDisabled,
  isPending,
  onClick,
}) {
  const baseStyles = [
    'inline-flex',
    'px-4 py-2 mb-2',
    'text-white',
    'font-bold',
    'rounded',
    'bg-blue-500',
    'focus:shadow-outline',
  ];
  const activeStyles = [
    'hover:bg-blue-700',
    'focus:outline-none',
    'transition',
    'ease-in-out',
    'duration-150',
  ];
  const disabledStyles = [
    'opacity-50',
    'cursor-not-allowed',
  ];

  const classNames = (isDisabled || isPending)
    ? baseStyles.concat(disabledStyles)
    : baseStyles.concat(activeStyles);

  return (
    <button id={id} type={type}
        className={className + ' ' + classNames.join(' ')}
        disabled={isDisabled || isPending}
        onClick={onClick}>
      {isPending ? <Spinner /> : ''}
      {isPending ? labelPending : label}
    </button>
  );
}