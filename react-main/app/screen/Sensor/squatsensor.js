import React, { useEffect, useState } from 'react';
import HumanPose from 'react-native-human-pose';
import { View, Text } from 'react-native';

export const Squatsensor = () => {
  const [noOfSquats, setNoOfSquats] = useState(0);
  const [hasSit, setHasSit] = useState(false);
  const [hasStand, setHasStand] = useState(false);

  const calculateAngle = (joint1, joint2, joint3) => {
    const radians = Math.atan2(joint3.y - joint2.y, joint3.x - joint2.x) - Math.atan2(joint1.y - joint2.y, joint1.x - joint2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);

    // Ensure angle is within 0 to 360 degrees
    if (angle > 180) {
      angle = 360 - angle;
    }

    return angle;
  };

  const onPoseDetected = (pose) => {
    const leftHip = pose[0]?.pose?.leftHip;
    const leftKnee = pose[0]?.pose?.leftKnee;
    const leftAnkle = pose[0]?.pose?.leftAnkle;

    const rightHip = pose[0]?.pose?.rightHip;
    const rightKnee = pose[0]?.pose?.rightKnee;
    const rightAnkle = pose[0]?.pose?.rightAnkle;

    const minConfidence = 0.5; // Adjust the confidence level as needed

    if (
      leftHip?.confidence > minConfidence &&
      leftKnee?.confidence > minConfidence &&
      leftAnkle?.confidence > minConfidence &&
      rightHip?.confidence > minConfidence &&
      rightKnee?.confidence > minConfidence &&
      rightAnkle?.confidence > minConfidence
    ) {
      const leftHipKneeAnkleAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightHipKneeAnkleAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

      if (leftHipKneeAnkleAngle > 160 && rightHipKneeAnkleAngle > 160) {
        // Adjust the threshold angle as needed
        setHasSit(true);
        setHasStand(false);
      }

      if (hasSit && (leftHipKneeAnkleAngle < 140 || rightHipKneeAnkleAngle < 140)) {
        // Adjust the threshold angle as needed
        setHasStand(true);
        setHasSit(false);
      }
    }
  };

  useEffect(() => {
    setNoOfSquats(hasStand ? noOfSquats + 1 : noOfSquats);
  }, [hasStand]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Human Pose</Text>
      <HumanPose
        height={500}
        width={400}
        enableKeyPoints={true}
        enableSkeleton={true}
        flipHorizontal={false}
        isBackCamera={false}
        color={'255, 0, 0'}
        mode={'single'} // Set mode to 'single'
        onPoseDetected={onPoseDetected}
      />
      <Text
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: 'center',
          textShadowColor: 'black',
          backgroundColor: 'white',
          padding: 10,
          fontSize: 20,
        }}>
        No of Squats: {noOfSquats}
      </Text>
    </View>
  );
};

export default Squatsensor;
