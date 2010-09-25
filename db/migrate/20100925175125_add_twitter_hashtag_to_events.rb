class AddTwitterHashtagToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :twitter_hashtag, :string
  end

  def self.down
    remove_column :events, :twitter_hashtag
  end
end
