import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "../../hook/useFetch";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, icons, SIZES } from "../../constants";
import { ScreenHeaderBtn, Company, JobAbout, JobFooter, JobTabs, Specifics } from "../../components";
import { ScrollView, RefreshControl, ActivityIndicator } from "react-native";

const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { data, isLoading, error, refetch } = useFetch("job-details", {
    job_id: params.id,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);
  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualifications":
        return <Specifics title="Qualifications" points={data[0].job_highlights?.Qualifications ?? ["N/A"]} />;

      case "About":
        return <JobAbout info={data[0].job_description ?? "No data provided"} />;

      case "Responsibilities":
        return <Specifics title="Responsibilities" points={data[0].job_highlights?.Responsibilities ?? ["N/A"]} />;

      default:
        return null;
    }
  };
  console.log("data", data);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => <ScreenHeaderBtn dimension={"60%"} iconUrl={icons.left} handlePress={() => router.back()} />,
          headerRight: () => <ScreenHeaderBtn dimension={"60%"} iconUrl={icons.share} />,
          headerTitle: "",
        }}
      />
      <>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : data.length === 0 ? (
            <Text>No data</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company companyLogo={data[0].employer_logo} jobTitle={data[0].job_title} companyName={data[0].employer_name} location={data[0].job_country} />

              <JobTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
              {displayTabContent()}
            </View>
          )}
        </ScrollView>
        <JobFooter url={data[0]?.job_google_link ?? "https://careers.google.com/jobs/results/"} />
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
