jest.mock('@folio/stripes-components/lib/Icon', () => {
  return ({ icon = 'Icon' }) => <span>{icon}</span>;
});
