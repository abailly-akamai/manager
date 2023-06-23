import { Config } from '@linode/api-v4/lib/linodes';
import * as React from 'react';
import CheckBox from 'src/components/CheckBox';
import { makeStyles } from '@mui/styles';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import Paginate from 'src/components/Paginate';
import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Table } from 'src/components/Table';
import { TableRow } from 'src/components/TableRow';
import { TableRowEmpty } from 'src/components/TableRowEmpty/TableRowEmpty';
import { ConfigSelection } from './utilities';

const useStyles = makeStyles(() => ({
  root: {
    '& td': {
      borderBottom: 'none',
      paddingBottom: 0,
      paddingTop: 0,
    },
  },
}));
export interface Props {
  configs: Config[];
  configSelection: ConfigSelection;
  handleSelect: (id: number) => void;
}

export const Configs: React.FC<Props> = (props) => {
  const { configSelection, configs, handleSelect } = props;

  const classes = useStyles();

  return (
    <Paginate data={configs}>
      {({
        count,
        data: paginatedData,
        handlePageChange,
        handlePageSizeChange,
        page,
        pageSize,
      }) => {
        return (
          <div>
            <Table aria-label="List of Configurations" className={classes.root}>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRowEmpty colSpan={1} />
                ) : (
                  paginatedData.map((config: Config) => (
                    <TableRow key={config.id} data-qa-config={config.label}>
                      <TableCell>
                        <CheckBox
                          checked={
                            configSelection[config.id] &&
                            configSelection[config.id].isSelected
                          }
                          onChange={() => handleSelect(config.id)}
                          text={config.label}
                          data-testid={`checkbox-${config.id}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <PaginationFooter
              count={count}
              page={page}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handleSizeChange={handlePageSizeChange}
              eventCategory="linode configs"
            />
          </div>
        );
      }}
    </Paginate>
  );
};

export default Configs;
