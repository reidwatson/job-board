/**
 * Format salary range or single salary value
 */
export const formatSalary = (minSalary?: number, maxSalary?: number): string => {
  if (!minSalary && !maxSalary) {
    return 'Salary not specified';
  }
  
  if (minSalary && maxSalary) {
    if (minSalary === maxSalary) {
      return `$${minSalary.toLocaleString()}`;
    }
    return `$${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}`;
  }
  
  if (minSalary) {
    return `From $${minSalary.toLocaleString()}`;
  }
  
  if (maxSalary) {
    return `Up to $${maxSalary.toLocaleString()}`;
  }
  
  return 'Salary not specified';
};

/**
 * Format date to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // Calculate time difference
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    // Format as date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}; 