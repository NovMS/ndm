import React, {useState, Fragment} from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from 'react-redux';
import { settingsChanged } from './../../actions/settings';
import Button from '@material-ui/core/Button';

const Root = styled(FormGroup)`
  width: 500px;
  padding: 15px;
  padding-top: 5px;
`;

const Item = styled(FormControlLabel)`
  width: 50%;
  margin: 0;
`;

const Line = styled.div`
  width: 100%;
  height: 2px;
  background-color: rgba(224,224,224,1);
  margin: 5px 0;
`;

const CtrBtns = styled.div`
  width: 100%;
  padding: 15px;
`;

const CtrBtn = styled(Button)`
  width: 48%;
  margin-right: 4%;
  font-size: 12px;
  &:nth-child(2n) {
    margin-right: 0;
  };
`;

const CheckboxList = ({type, items, settings, settingsChanged}) => {

  const changeAll = (list, value) => {
    let newList = {};
    list.map((itemList) => {
      Object.entries(itemList).map(([key]) => {
        newList[key] = value;
      });
    });
    return newList;
  };

  return (
    <>
    {
      ((type == 'sources') || (type == 'competitors')) ?
      <CtrBtns>
        <CtrBtn
          variant="outlined"
          onClick={() => {
            settingsChanged({
              [type]: {
                ...settings[type],
                ...changeAll(items, true)
              }
            })
          }}
        >Выбрать все</CtrBtn>

        <CtrBtn
          variant="outlined"
          onClick={() => {
            settingsChanged({
              [type]: {
                ...settings[type],
                ...changeAll(items, false)
              }
            })
          }}
        >Отменить все</CtrBtn>
      </CtrBtns> : null
    }
    <Root row>
    {
      items.map((item, i) => {
        return (
        <Fragment key={i}>
        {
          (i != 0) ? <Line /> : null
        }
        {
          Object.entries(item).map(([key, value]) => {
            return (
              <Item
                key={key}
                control={
                  <Checkbox
                    checked={settings[type][key] ? settings[type][key] : false}
                    onChange={() => settingsChanged({
                      [type]: {
                        ...settings[type],
                        [key]: settings[type][key] ? false : true 
                      }
                    })}
                    value={key}
                    color="primary"
                  />
                }
                label={value}
              />
            )
          })
        }
        </Fragment>
        )
      })
    }
    </Root>
    </>
  );
};

const mapStateToProps = ({ settings }) => {
  return { settings };
};

const mapDispatchToProps = {
  settingsChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckboxList);