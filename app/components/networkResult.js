const RevertReason = /desc = execution reverted: (.*)$/;
export default function NetworkResult({result}) {
  if (!result) {
    return '';
  }

  if (result.error) {
    const matched = result.error.match(RevertReason);
    const message = matched && matched.length >= 2
      ? matched[1]
      : result.error;
    return (
      <p className='text-red-700 text-center mb-2'>
        {message}
      </p>
    );
  }

  if (result.message) {
    return (
      <p className='text-green-700 text-center mb-2'>
        {result.message}
      </p>
    );
  }

  return '';
}
