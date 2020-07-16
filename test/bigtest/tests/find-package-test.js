import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { Pluggable } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';

import setupApplication, { mount } from '../helpers/helpers';
import PluginInteractor from '../interactors/plugin';
import {
  selectedPackages,
  notSelectedPackages,
} from '../constants';

const onRecordChosenHandler = sinon.spy();


describe('ui-plugin-find-package-title', function () {
  const plugin = new PluginInteractor();
  setupApplication();

  const renderComponent = (props = {}) => {
    return mount(
      <Pluggable
        type="find-package-title"
        onRecordChosen={onRecordChosenHandler}
        {...props}
      />
    );
  };

  describe('when the plugin is provided a custom trigger button', () => {
    beforeEach(async function () {
      await mount(
        <Pluggable
          type="find-package-title"
          renderCustomTrigger={props => (
            <Button
              {...props}
              data-test-custom-trigger
            >
              <span>Trigger</span>
            </Button>
          )}
          onRecordChosen={() => { }}
        />
      );
    });

    it('should render the custom trigger', () => {
      expect(plugin.customTriggerIsDisplayed).to.be.true;
    });
  });

  describe('when the plugin is rendered with the default trigger', function () {
    beforeEach(async function () {
      onRecordChosenHandler.resetHistory();

      await renderComponent();
    });

    it('should render the default trigger button', function () {
      expect(plugin.defaultTriggerIsDisplayed).to.be.true;
    });

    describe('and the trigger button is clicked', () => {
      beforeEach(async () => {
        await plugin.triggerButton.click();
      });

      it('should open the plugin modal', () => {
        expect(plugin.modalIsDisplayed).to.be.true;
      });

      it('should focus the search field by default', () => {
        expect(plugin.modal.searchField.isFocused).to.be.true;
      });

      it('should disable the search button by default', () => {
        expect(plugin.modal.searchButton.isEnabled).to.be.false;
      });

      it('should disable the reset button by default', () => {
        expect(plugin.modal.resetButton.isEnabled).to.be.false;
      });

      it('should disable search by tags by default', () => {
        expect(plugin.modal.searchByTagsDisabled).to.be.true;
      });

      it('should disable search by access types by default', () => {
        expect(plugin.modal.searchByAccessTypesDisabled).to.be.true;
      });

      it('should ask the user to enter a search query', () => {
        expect(plugin.modal.searchPromptDisplayed).to.be.true;
      });

      describe('and a search query was entered', () => {
        beforeEach(async () => {
          await plugin.modal.searchField.fill('selected');
        });

        it('should enable the search button', () => {
          expect(plugin.modal.searchButton.isEnabled).to.be.true;
        });

        it('should enable the reset button', () => {
          expect(plugin.modal.resetButton.isEnabled).to.be.true;
        });

        describe('and searching by tags was enabled', () => {
          beforeEach(async () => {
            await plugin.modal.toggleSearchByTags();
          });

          it('should enable searching by tags', () => {
            expect(plugin.modal.searchByTagsDisabled).to.be.false;
          });

          it('should disable search field', () => {
            expect(plugin.modal.searchField.isEnabled).to.be.false;
          });

          it('should disable search button', () => {
            expect(plugin.modal.searchButton.isEnabled).to.be.false;
          });

          describe('and a tag was selected', () => {
            beforeEach(async () => {
              await plugin.modal.tagsFilterSelect.clickOption(1);
            });

            it('should display only tagged packages', () => {
              expect(plugin.modal.resultsList.rows().length).to.equal(1);
              expect(plugin.modal.resultsList.rows(0).cells(1).content).to.equal('Tagged package');
            });
          });
        });

        describe('and searching by access types was enabled', () => {
          beforeEach(async () => {
            await plugin.modal.toggleSearchByAccessTypes();
          });

          it('should enable searching by tags', () => {
            expect(plugin.modal.searchByAccessTypesDisabled).to.be.false;
          });

          it('should disable search field', () => {
            expect(plugin.modal.searchField.isEnabled).to.be.false;
          });

          it('should disable search button', () => {
            expect(plugin.modal.searchButton.isEnabled).to.be.false;
          });

          describe('and an access type was selected', () => {
            beforeEach(async () => {
              await plugin.modal.accessTypesFilterSelect.clickOption(1);
            });

            it('should display only packages with access types', () => {
              expect(plugin.modal.resultsList.rows().length).to.equal(1);
              expect(plugin.modal.resultsList.rows(0).cells(1).content).to.equal('With access types');
            });
          });
        });

        describe('and submit button was clicked', () => {
          beforeEach(async () => {
            await plugin.modal.searchButton.click();
          });

          it('should display a list of loaded packages', () => {
            expect(plugin.modal.resultsList.rows().length).to.equal(3);
          });

          describe('and reset button was clicked', () => {
            beforeEach(async () => {
              await plugin.modal.resetButton.click();
            });

            it('should reset the search field to the initial value', () => {
              expect(plugin.modal.searchField.value).to.equal('');
            });

            it('should ask the user to enter a search query', () => {
              expect(plugin.modal.searchPromptDisplayed).to.be.true;
            });
          });

          describe('and not selected filter was clicked', () => {
            beforeEach(async () => {
              await plugin.modal.clickNotSelectedFilter();
            });

            it('should display only not selected packages', () => {
              expect(plugin.modal.resultsList.rows().length).to.equal(3);
              expect(plugin.modal.resultsList.rows(0).cells(1).content).to.equal('Not selected');
            });

            describe('and a package was selected', () => {
              beforeEach(async () => {
                await plugin.modal.resultsList.rows(0).click();
              });

              it('should close the modal', () => {
                expect(plugin.modalIsDisplayed).to.be.false;
              });

              it('should call the provided callback with the data of the selected package', () => {
                const { attributes, id, type } = notSelectedPackages[0];

                expect(onRecordChosenHandler.calledOnceWith({
                  id,
                  type,
                  ...attributes,
                })).to.be.true;
              });
            });
          });
        });
      });
    });
  });

  describe('when the plugin is rendered with a multiselect prop', () => {
    beforeEach(async function () {
      onRecordChosenHandler.resetHistory();

      await renderComponent({
        isMultiSelect: true,
      });
    });

    describe('and a trigger button is clicked', () => {
      beforeEach(async () => {
        await plugin.triggerButton.click();
      });

      it('should open the plugin modal', () => {
        expect(plugin.modalIsDisplayed).to.be.true;
      });

      describe('when searching for packages', () => {
        beforeEach(async () => {
          await plugin.modal.searchField.fill('Selected');
          await plugin.modal.clickSelectedFilter();
        });

        describe('and submit button was clicked', () => {
          beforeEach(async () => {
            await plugin.modal.searchButton.click();
          });

          it('should display a list of loaded packages', () => {
            expect(plugin.modal.resultsList.rows().length).to.equal(2);
          });

          describe('and a package was selected', () => {
            beforeEach(async () => {
              await plugin.modal.resultsList.rows(0).click();
            });

            it('should not close the modal', () => {
              expect(plugin.modalIsDisplayed).to.be.true;
            });

            it('should update titles selected count in the footer', () => {
              expect(plugin.modal.titlesSelectedText).to.equal('Titles selected: 1');
            });

            describe('and clicking Cancel', () => {
              beforeEach(async () => {
                await plugin.modal.cancelSelection();
              });

              it('should close the modal', () => {
                expect(plugin.modalIsDisplayed).to.be.false;
              });

              it('should not call the provided callback', () => {
                expect(onRecordChosenHandler.callCount).to.equal(0);
              });
            });

            describe('and selecting a second package', () => {
              beforeEach(async () => {
                await plugin.modal.resultsList.rows(1).click();
              });

              describe('and clicking Save', () => {
                beforeEach(async () => {
                  await plugin.modal.saveSelection();
                });

                it('should close the modal', () => {
                  expect(plugin.modalIsDisplayed).to.be.false;
                });

                it('should call the provided callback with correct data', () => {
                  const expectedPackages = selectedPackages
                    .map(({ id, type, attributes }) => ({
                      id,
                      type,
                      ...attributes,
                    }));
                  expect(onRecordChosenHandler.calledOnceWith(expectedPackages)).to.be.true;
                });
              });
            });
          });
        });
      });
    });
  });
});
