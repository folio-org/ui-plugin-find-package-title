import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { Pluggable } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';

import setupApplication, { mount } from '../helpers/helpers';
import PluginHarness from '../helpers/PluginHarness';
import PluginInteractor from '../interactors/plugin';

const onRecordChosenHandler = sinon.spy();


describe('ui-plugin-find-package-title', function () {
  const plugin = new PluginInteractor();
  setupApplication();

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

      await mount(
        <Pluggable
          type="find-package-title"
          onRecordChosen={onRecordChosenHandler}
        />
      );
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
          await plugin.modal.searchField.fill('some query');
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
            expect(plugin.modal.resultsList.rows().length).to.equal(4);
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
              expect(plugin.modal.resultsList.rows().length).to.equal(1);
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
                expect(onRecordChosenHandler.calledOnceWith({
                  id: '1075-7698',
                  type: 'packages',
                  contentType: 'Online Reference',
                  customCoverage: {
                    beginCoverage: '',
                    endCoverage: ''
                  },
                  isCustom: false,
                  isSelected: false,
                  name: 'Not selected',
                  packageId: 7698,
                  packageType: 'Complete',
                  providerId: 1075,
                  providerName: 'ABC Chemistry',
                  selectedCount: 0,
                  titleCount: 1,
                  visibilityData: {
                    isHidden: false,
                    reason: ''
                  }
                })).to.be.true;
              });
            });
          });
        });
      });
    });
  });
});
