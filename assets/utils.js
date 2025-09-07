const getDomainsOfInterest = () => {
  const checkedDomains = document.querySelectorAll(
    'input[name="domainsOfInterest"]:checked'
  );

  const domainsArray = Array.from(checkedDomains).map(
    (checkbox) => checkbox.value
  );

  const domainsOfInterest = domainsArray.join(",");

  return domainsOfInterest;
};

export { getDomainsOfInterest };
