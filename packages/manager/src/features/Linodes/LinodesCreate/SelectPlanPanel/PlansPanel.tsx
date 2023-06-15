import * as React from 'react';
import { LinodeTypeClass, BaseType } from '@linode/api-v4/lib/linodes';
import { TabbedPanel } from 'src/components/TabbedPanel/TabbedPanel';
import { ExtendedType } from 'src/utilities/extendType';
import {
  determineInitialPlanCategoryTab,
  getPlanSelectionsByPlanType,
  planTabInfoContent,
} from './utils';
import { PlanContainer } from './PlanContainer';
import { useSelectPlanPanelStyles } from './styles/plansPanelStyles';
import { PlanInformation } from './PlanInformation';
import { usePremiumPlansUtils } from 'src/hooks/usePremiumPlans';
import type { Region } from '@linode/api-v4';

export interface PlanSelectionType extends BaseType {
  class: ExtendedType['class'];
  formattedLabel: ExtendedType['formattedLabel'];
  heading: ExtendedType['heading'];
  network_out?: ExtendedType['network_out'];
  price: ExtendedType['price'];
  subHeadings: ExtendedType['subHeadings'];
  transfer?: ExtendedType['transfer'];
}
interface Props {
  className?: string;
  copy?: string;
  currentPlanHeading?: string;
  disabled?: boolean;
  disabledClasses?: LinodeTypeClass[];
  docsLink?: JSX.Element;
  error?: string;
  header?: string;
  isCreate?: boolean;
  linodeID?: number | undefined;
  onSelect: (key: string) => void;
  regionsData?: Region[];
  selectedDiskSize?: number;
  selectedID?: string;
  selectedRegionID?: string;
  showTransfer?: boolean;
  tabbedPanelInnerClass?: string;
  types: PlanSelectionType[];
}

export const PlansPanel = (props: Props) => {
  const {
    className,
    copy,
    currentPlanHeading,
    disabled,
    docsLink,
    error,
    header,
    isCreate,
    linodeID,
    onSelect,
    regionsData,
    selectedID,
    selectedRegionID,
    showTransfer,
    types,
  } = props;

  const { classes } = useSelectPlanPanelStyles();
  const plans = getPlanSelectionsByPlanType(types);
  const {
    hasSelectedRegion,
    isDisabledPremiumPlan,
    isSelectedRegionPremium,
  } = usePremiumPlansUtils({
    selectedRegionID,
    regionsData,
  });

  const tabs = Object.keys(plans).map((plan: LinodeTypeClass) => {
    return {
      render: () => {
        return (
          <>
            <PlanInformation
              disabledClasses={props.disabledClasses}
              hasSelectedRegion={hasSelectedRegion}
              isSelectedRegionPremium={isSelectedRegionPremium}
              planType={plan}
              regionsData={regionsData || []}
            />
            <PlanContainer
              currentPlanHeading={currentPlanHeading}
              disabled={disabled || isDisabledPremiumPlan(plan)}
              disabledClasses={props.disabledClasses}
              isCreate={isCreate}
              linodeID={linodeID}
              onSelect={onSelect}
              plans={plans[plan]}
              selectedDiskSize={props.selectedDiskSize}
              selectedID={selectedID}
              showTransfer={showTransfer}
            />
          </>
        );
      },
      title: planTabInfoContent[plan === 'standard' ? 'shared' : plan]?.title,
    };
  });

  const initialTab = determineInitialPlanCategoryTab(
    types,
    selectedID,
    currentPlanHeading
  );

  return (
    <TabbedPanel
      rootClass={`${classes.root} ${className} tabbedPanel`}
      innerClass={props.tabbedPanelInnerClass}
      error={error}
      header={header || 'Linode Plan'}
      copy={copy}
      tabs={tabs}
      initTab={initialTab >= 0 ? initialTab : 0}
      docsLink={docsLink}
      data-qa-select-plan
    />
  );
};

export default PlansPanel;